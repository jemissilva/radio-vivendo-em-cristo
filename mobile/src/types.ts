export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  hostName: string;
  active: boolean;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEntry {
  id: string;
  programId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isLive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  program?: Program | null;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  author: string;
  audioUrl: string;
  imageUrl?: string;
  durationSeconds: number;
  publishedAt?: string;
  status: string;
  categoryIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  location?: string;
  startAt: string;
  endAt?: string;
  bannerImageUrl?: string;
  externalUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StreamStatus {
  isLive: boolean;
  streamUrl: string;
  fallbackUrl?: string;
  currentTrack: string;
  bitrateKbps: number;
  listenersNow: number;
  updatedAt: string;
}

export interface PrayerFormState {
  name: string;
  email: string;
  request: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}