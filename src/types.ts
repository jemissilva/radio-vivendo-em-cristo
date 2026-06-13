export type AdminRole =
  | "admin"
  | "content_editor"
  | "radio_operator"
  | "moderator";

export type ContentType =
  | "pregacao"
  | "devocional"
  | "louvor"
  | "podcast"
  | "programa_especial";

export type PublicationStatus = "draft" | "published" | "archived";

export type InteractionStatus = "new" | "in_progress" | "answered" | "closed";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
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
  type: ContentType;
  author: string;
  audioUrl: string;
  imageUrl?: string;
  durationSeconds: number;
  publishedAt?: string;
  status: PublicationStatus;
  categoryIds: string[];
  programId?: string;
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

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: InteractionStatus;
  classification?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  request: string;
  privateRequest: boolean;
  status: InteractionStatus;
  assignedTo?: string;
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

export interface AnalyticsSnapshot {
  listenersNow: number;
  peakListenersToday: number;
  averageSessionMinutes: number;
  topContentIds: string[];
  contactMessagesToday: number;
  prayerRequestsToday: number;
  streamUptimePercent: number;
}