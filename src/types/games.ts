export type GameType = 'flappy-pigeon' | 'love-catcher';

export type PlayerName = 'Dominik' | 'Mara';

export interface ScoreRecord {
  id: string;
  game: GameType;
  player: PlayerName;
  score: number;
  createdAt: string;
}

export interface GameHighScores {
  'flappy-pigeon': {
    dominik: number;
    mara: number;
  };
  'love-catcher': {
    dominik: number;
    mara: number;
  };
}

export interface ScoreState {
  highScores: GameHighScores;
  recentActivity: ScoreRecord[];
}

export interface RealtimeMessage {
  type: 'init' | 'new_score' | 'live_cheer' | 'presence';
  payload?: any;
}
