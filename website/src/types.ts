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
  program?: Program | null;
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

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminAuthResponse {
  token: string;
  user: AdminUser;
}

export interface AdminProgram {
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

export interface AdminScheduleEntry {
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

export interface AdminContentItem {
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
}

export interface AdminEventItem {
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

export type InteractionStatus = "new" | "in_progress" | "answered" | "closed";

export interface AdminMessage {
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

export interface AdminPrayerRequest {
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

export interface AdminStreamStatus {
  isLive: boolean;
  streamUrl: string;
  fallbackUrl?: string;
  currentTrack: string;
  bitrateKbps: number;
  listenersNow: number;
  updatedAt: string;
}

export interface ZaraIntegrationStatus {
  currentTrack: string;
  lastSyncTime: string;
  connected: boolean;
}

export interface AdminDashboardPayload {
  analytics: {
    listenersNow: number;
    peakListenersToday: number;
    averageSessionMinutes: number;
    topContentIds: string[];
    contactMessagesToday: number;
    prayerRequestsToday: number;
    streamUptimePercent: number;
  };
  totals: {
    programs: number;
    scheduleEntries: number;
    contentItems: number;
    events: number;
    banners: number;
    contactMessages: number;
    prayerRequests: number;
  };
  latestMessages: AdminMessage[];
  latestPrayerRequests: AdminPrayerRequest[];
}