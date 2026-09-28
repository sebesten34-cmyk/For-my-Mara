import { GameType, PlayerName, ScoreState, ScoreRecord } from '../types/games';

type ScoreListener = (state: ScoreState, latestEvent?: { type: string; payload: any }) => void;
type CheerListener = (from: PlayerName) => void;

class RealtimeScoreService {
  private socket: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private scoreListeners: Set<ScoreListener> = new Set();
  private cheerListeners: Set<CheerListener> = new Set();
  private currentState: ScoreState = {
    highScores: {
      'flappy-pigeon': { dominik: 0, mara: 0 },
      'love-catcher': { dominik: 0, mara: 0 },
    },
    recentActivity: [],
  };
  private isConnecting = false;
  private reconnectTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initConnection();
      // Also fetch immediately via REST to ensure fast display
      this.fetchInitialScores();
    }
  }

  public getPlayer(): PlayerName {
    if (typeof window === 'undefined') return 'Dominik';
    const saved = localStorage.getItem('anniversary_active_player');
    return saved === 'Mara' ? 'Mara' : 'Dominik';
  }

  public setPlayer(player: PlayerName) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anniversary_active_player', player);
    }
  }

  public getState(): ScoreState {
    return this.currentState;
  }

  public subscribe(listener: ScoreListener): () => void {
    this.scoreListeners.add(listener);
    // Call immediately with current state
    listener(this.currentState);
    return () => {
      this.scoreListeners.delete(listener);
    };
  }

  public subscribeCheers(listener: CheerListener): () => void {
    this.cheerListeners.add(listener);
    return () => {
      this.cheerListeners.delete(listener);
    };
  }

  public async fetchInitialScores() {
    try {
      const res = await fetch('/api/scores');
      if (res.ok) {
        const data = await res.json();
        if (data && data.highScores) {
          this.currentState = data;
          this.notifyScoreListeners({ type: 'init', payload: data });
        }
      }
    } catch (err) {
      console.warn('Could not fetch initial scores via REST:', err);
    }
  }

  private initConnection() {
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;

    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        this.isConnecting = false;
        this.socket = ws;
        console.log('Realtime WebSocket connected for mini-games');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingEvent(msg);
        } catch (e) {
          console.warn('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        this.isConnecting = false;
        this.socket = null;
        this.fallbackToSSE();
        this.scheduleReconnect();
      };

      ws.onerror = () => {
        this.isConnecting = false;
        this.fallbackToSSE();
      };
    } catch {
      this.isConnecting = false;
      this.fallbackToSSE();
      this.scheduleReconnect();
    }
  }

  private fallbackToSSE() {
    if (this.eventSource || typeof window === 'undefined' || !window.EventSource) return;

    try {
      const es = new EventSource('/api/scores/stream');
      es.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingEvent(msg);
        } catch (e) {
          console.warn('Error parsing SSE data:', e);
        }
      };
      es.onerror = () => {
        es.close();
        this.eventSource = null;
      };
      this.eventSource = es;
    } catch (err) {
      console.warn('SSE fallback error:', err);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.initConnection();
    }, 4000);
  }

  private handleIncomingEvent(msg: { type: string; payload: any }) {
    if (msg.type === 'init') {
      if (msg.payload?.highScores) {
        this.currentState = msg.payload;
        this.notifyScoreListeners(msg);
      }
    } else if (msg.type === 'new_score') {
      const { highScores, recentActivity } = msg.payload;
      if (highScores) {
        this.currentState.highScores = highScores;
      }
      if (recentActivity) {
        this.currentState.recentActivity = recentActivity;
      }
      this.notifyScoreListeners(msg);
    } else if (msg.type === 'live_cheer') {
      const from = msg.payload?.from;
      if (from) {
        for (const listener of this.cheerListeners) {
          listener(from);
        }
      }
    }
  }

  private notifyScoreListeners(event?: any) {
    for (const listener of this.scoreListeners) {
      listener(this.currentState, event);
    }
  }

  public async submitScore(game: GameType, player: PlayerName, score: number): Promise<boolean> {
    const payload = { game, player, score };

    // Try sending via WebSocket if open
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'submit_score', payload }));
    }

    // Always also send via REST to guarantee delivery and persistence
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.highScores) {
          this.currentState.highScores = data.highScores;
          this.currentState.recentActivity = data.recentActivity;
          this.notifyScoreListeners({ type: 'new_score', payload: data });
        }
        return true;
      }
    } catch (err) {
      console.error('Failed to submit score via REST:', err);
    }

    return false;
  }

  public async sendLiveCheer(from: PlayerName) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'cheer', payload: { from } }));
    }

    try {
      await fetch('/api/cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from }),
      });
    } catch {
      // ignore
    }
  }
}

export const realtimeScores = new RealtimeScoreService();
