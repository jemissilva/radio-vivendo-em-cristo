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
  getLive: () => request<StreamStatus>("/live"),
  getSchedule: () => request<ScheduleEntry[]>("/schedule"),
  getPrograms: () => request<Program[]>("/programs"),
  getContent: () => request<ContentItem[]>("/content"),
  getEvents: () => request<EventItem[]>("/events"),
  sendContact: (payload: ContactPayload) =>
    request<ApiMessageResponse<{ id: string }>>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendPrayerRequest: (payload: PrayerPayload) =>
    request<ApiMessageResponse<{ id: string }>>("/prayer-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};