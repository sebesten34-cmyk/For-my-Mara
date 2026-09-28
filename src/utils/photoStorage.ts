/**
 * Robust IndexedDB storage for couple anniversary photo album
 * Bypasses localStorage 5MB quota limits and includes client-side compression.
 */

import { MonthAlbum, PhotoItem } from '../types';
import { INITIAL_MONTHS } from '../data/anniversaryData';

const DB_NAME = 'DominikMaraPhotosDB';
const DB_VERSION = 1;
const STORE_NAME = 'albums';
const ALBUM_RECORD_KEY = 'photo_months_data';
const OLD_LOCALSTORAGE_KEY = 'dominik_mara_photo_album';

function openPhotoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Load saved photos from IndexedDB (or fallback to localStorage migration)
 */
export async function loadSavedAlbums(): Promise<MonthAlbum[]> {
  try {
    const db = await openPhotoDB();
    const saved = await new Promise<MonthAlbum[] | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(ALBUM_RECORD_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (saved && Array.isArray(saved) && saved.length > 0) {
      return mergeWithInitialMonths(saved);
    }
  } catch (err) {
    console.warn('IndexedDB load failed, trying localStorage fallback:', err);
  }

  // Fallback / Migration from old localStorage
  try {
    const local = localStorage.getItem(OLD_LOCALSTORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = mergeWithInitialMonths(parsed);
        // Save into IndexedDB so it's migrated
        saveAlbumsToStorage(merged).catch(() => {});
        return merged;
      }
    }
  } catch (e) {
    console.warn('LocalStorage migration fallback error:', e);
  }

  return INITIAL_MONTHS;
}

/**
 * Persist albums to IndexedDB safely
 */
export async function saveAlbumsToStorage(months: MonthAlbum[]): Promise<void> {
  try {
    const db = await openPhotoDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(months, ALBUM_RECORD_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    // Remove heavy base64 data from localStorage if it exists to free quota
    try {
      localStorage.removeItem(OLD_LOCALSTORAGE_KEY);
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('Failed to save photos to IndexedDB:', err);
  }
}

/**
 * Helper to read an uploaded file as exact DataURL without altering pixels,
 * falling back to compression only if file is extremely large (> 8MB)
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size <= 8 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      compressImageFile(file, 2048, 0.9).then(resolve).catch(reject);
    }
  });
}

/**
 * Helper to compress and resize an uploaded image File to a lightweight high-quality DataURL
 */
export function compressImageFile(file: File, maxDimension = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, or jpeg
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function mergeWithInitialMonths(savedList: MonthAlbum[]): MonthAlbum[] {
  return INITIAL_MONTHS.map((initM) => {
    const savedM = savedList.find((m) => m.id === initM.id);
    if (!savedM) return initM;
    return {
      ...initM,
      photos: initM.photos.map((initP, pIdx) => {
        const savedP = savedM.photos?.[pIdx];
        if (savedP && (savedP.isCustom || (savedP.url && savedP.url.startsWith('data:')))) {
          return {
            ...initP,
            url: savedP.url,
            isCustom: true,
          };
        }
        return initP;
      }) as [PhotoItem, PhotoItem, PhotoItem],
    };
  });
}
