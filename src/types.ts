export interface Letter {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  content: string;
  dateAdded?: string;
  envelopeColor: string;
  stampEmoji: string;
}

export interface PhotoItem {
  id: string;
  caption: string;
  dateText: string;
  url: string;
  isCustom?: boolean;
}

export interface MonthAlbum {
  id: number;
  monthName: string;
  year: number;
  monthNumber: number; // 1 to 9
  tagline: string;
  memoryNote: string;
  photos: [PhotoItem, PhotoItem, PhotoItem];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  dedication: string;
  themeColor: string;
  melodyType: 'canon' | 'romantic' | 'lullaby' | 'dream' | 'waltz';
  audioUrl?: string;
  customAudioUrl?: string;
}

export interface FutureMilestone {
  id: string;
  title: string;
  timelineLabel: string;
  targetDate?: string;
  description: string;
  icon: string;
  category: 'aniversare' | 'scoli' | 'viata' | 'familie' | 'pentru-totdeauna';
  isKeyMilestone?: boolean;
}

export interface BucketItem {
  id: string;
  text: string;
  dateAdded: string;
  isCompleted: boolean;
  heartCount: number;
}
