import { MonthAlbum, PhotoItem } from '../types';
import { INITIAL_MONTHS } from '../data/anniversaryData';
import { loadSavedAlbums, saveAlbumsToStorage } from '../utils/photoStorage';

export interface PhotoRecord {
  monthId: number;
  photoId: string;
  url: string;
  updatedAt: string;
}

export type PhotosMap = Record<string, PhotoRecord>;
type PhotoUpdateListener = (photosMap: PhotosMap) => void;

class CrossDevicePhotoService {
  private photosMap: PhotosMap = {};
  private listeners: Set<PhotoUpdateListener> = new Set();
  private socket: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Fetch current server photos
    await this.fetchServerPhotos();

    // 2. Setup real-time connection
    this.setupRealtimeSync();

    // 3. Auto-sync any local IndexedDB photos to the server
    this.syncLocalPhotosToServer().catch(console.error);

    // 4. Re-fetch on visibility change (mobile unlock, tab focus)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.fetchServerPhotos().catch(() => {});
        }
      });
      window.addEventListener('focus', () => {
        this.fetchServerPhotos().catch(() => {});
      });
    }
  }

  public subscribe(listener: PhotoUpdateListener): () => void {
    this.listeners.add(listener);
    listener(this.photosMap);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getPhotosMap(): PhotosMap {
    return this.photosMap;
  }

  public async fetchServerPhotos(): Promise<PhotosMap> {
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          this.photosMap = data;
          this.notifyListeners();
        }
      }
    } catch (err) {
      console.warn('Could not fetch server photos:', err);
    }
    return this.photosMap;
  }

  public async savePhoto(monthId: number, photoId: string, url: string): Promise<boolean> {
    const key = `${monthId}_${photoId}`;
    const record: PhotoRecord = {
      monthId,
      photoId,
      url,
      updatedAt: new Date().toISOString(),
    };

    // Update local state immediately
    this.photosMap[key] = record;
    this.notifyListeners();

    // Send via WebSocket if open
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'update_photo', payload: record }));
    }

    // Persist to server via REST
    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.photo) {
          this.photosMap[key] = data.photo;
          this.notifyListeners();
        }
      } else {
        console.warn('Failed to save photo to server REST API');
      }
    } catch (err) {
      console.error('Error saving photo to server:', err);
    }

    return true;
  }

  /**
   * Applies server photos onto a list of MonthAlbums
   */
  public mergeWithServerPhotos(months: MonthAlbum[]): MonthAlbum[] {
    return months.map((month) => {
      const updatedPhotos = month.photos.map((photo) => {
        const key = `${month.id}_${photo.id}`;
        const serverPhoto = this.photosMap[key];
        if (serverPhoto && serverPhoto.url) {
          return {
            ...photo,
            url: serverPhoto.url,
            isCustom: true,
          };
        }
        return photo;
      }) as [PhotoItem, PhotoItem, PhotoItem];

      return {
        ...month,
        photos: updatedPhotos,
      };
    });
  }

  /**
   * If this device already had custom photos in IndexedDB, upload them to server
   * so other devices can access them.
   */
  private async syncLocalPhotosToServer() {
    try {
      const localAlbums = await loadSavedAlbums();
      const photosToUpload: { monthId: number; photoId: string; url: string }[] = [];

      for (const m of localAlbums) {
        for (const p of m.photos) {
          if (p.isCustom || (p.url && p.url.startsWith('data:'))) {
            const key = `${m.id}_${p.id}`;
            // If server doesn't have it yet, queue for upload
            if (!this.photosMap[key]) {
              photosToUpload.push({
                monthId: m.id,
                photoId: p.id,
                url: p.url,
              });
            }
          }
        }
      }

      if (photosToUpload.length > 0) {
        console.log(`Syncing ${photosToUpload.length} local photos to server...`);
        const res = await fetch('/api/photos/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photos: photosToUpload }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.photos) {
            this.photosMap = data.photos;
            this.notifyListeners();
          }
        }
      }
    } catch (err) {
      console.warn('Error during local photos sync to server:', err);
    }
  }

  private setupRealtimeSync() {
    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        this.socket = ws;
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleEvent(msg);
        } catch {
          // ignore
        }
      };

      ws.onclose = () => {
        this.socket = null;
        this.setupSSEFallback();
      };

      ws.onerror = () => {
        this.setupSSEFallback();
      };
    } catch {
      this.setupSSEFallback();
    }
  }

  private setupSSEFallback() {
    if (this.eventSource || typeof window === 'undefined' || !window.EventSource) return;

    try {
      const es = new EventSource('/api/scores/stream');
      es.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleEvent(msg);
        } catch {
          // ignore
        }
      };
      this.eventSource = es;
    } catch (e) {
      console.warn('SSE fallback error:', e);
    }
  }

  private handleEvent(msg: { type: string; payload: any }) {
    if (msg.type === 'init_photos' && msg.payload) {
      this.photosMap = { ...this.photosMap, ...msg.payload };
      this.notifyListeners();
    } else if (msg.type === 'photo_updated' && msg.payload) {
      const { monthId, photoId, url, updatedAt } = msg.payload;
      const key = `${monthId}_${photoId}`;
      this.photosMap[key] = { monthId, photoId, url, updatedAt };
      this.notifyListeners();
    } else if (msg.type === 'photos_sync' && msg.payload) {
      this.photosMap = { ...this.photosMap, ...msg.payload };
      this.notifyListeners();
    }
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.photosMap);
    }
  }
}

export const crossDevicePhotos = new CrossDevicePhotoService();
