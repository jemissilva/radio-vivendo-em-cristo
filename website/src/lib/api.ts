import type {
  ApiMessageResponse,
  ContactPayload,
  ContentItem,
  EventItem,
  PrayerPayload,
  Program,
  ScheduleEntry,
  StreamStatus,
} from "../types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3001/api/public";

const offlineLive: StreamStatus = {
  isLive: false,
  streamUrl: "",
  fallbackUrl: "",
  currentTrack: "Programação Musical",
  bitrateKbps: 0,
  listenersNow: 0,
  updatedAt: new Date(0).toISOString(),
};

const offlineMessage = "Enviado (offline)";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Falha ao carregar dados");
  }

  return response.json() as Promise<T>;
}

export const api = {
  getLive: async () => {
    try {
      return await request<StreamStatus>("/live");
    } catch {
      return offlineLive;
    }
  },
  getSchedule: async () => {
    try {
      return await request<ScheduleEntry[]>("/schedule");
    } catch {
      return [];
    }
  },
  getPrograms: async () => {
    try {
      return await request<Program[]>("/programs");
    } catch {
      return [];
    }
  },
  getContent: async () => {
    try {
      return await request<ContentItem[]>("/content");
    } catch {
      return [];
    }
  },
  getEvents: async () => {
    try {
      return await request<EventItem[]>("/events");
    } catch {
      return [];
    }
  },
  sendContact: async (payload: ContactPayload) => {
    try {
      return await request<ApiMessageResponse<{ id: string }>>("/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return {
        message: offlineMessage,
        data: { id: "offline-contact" },
      };
    }
  },
  sendPrayerRequest: async (payload: PrayerPayload) => {
    try {
      return await request<ApiMessageResponse<{ id: string }>>("/prayer-requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return {
        message: offlineMessage,
        data: { id: "offline-prayer-request" },
      };
    }
  },
};