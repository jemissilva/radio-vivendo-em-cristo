export interface StreamStatus {
  isLive: boolean;
  streamUrl: string;
  fallbackUrl?: string;
  currentTrack: string;
  bitrateKbps: number;
  listenersNow: number;
  updatedAt: string;
}

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
  program: Program | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: "pregacao" | "devocional" | "louvor" | "podcast" | "programa_especial";
  author: string;
  audioUrl: string;
  imageUrl?: string;
  durationSeconds: number;
  publishedAt?: string;
  status: "draft" | "published" | "archived";
  categoryIds: string[];
  programId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  categories: Category[];
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

export interface ApiMessageResponse<T> {
  message: string;
  data: T;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface PrayerPayload {
  name: string;
  email?: string;
  phone?: string;
  request: string;
  privateRequest: boolean;
}