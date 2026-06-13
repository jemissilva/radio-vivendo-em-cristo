import { appConfig } from "@/src/config/app-config";
import { ContentItem, EventItem, Program, ScheduleEntry, StreamStatus } from "@/src/types";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Erro ao carregar ${path}`);
  }
  return response.json();
}

export function fetchLive() {
  return request<StreamStatus>("/live");
}

export function fetchSchedule() {
  return request<ScheduleEntry[]>("/schedule");
}

export function fetchPrograms() {
  return request<Program[]>("/programs");
}

export function fetchContent() {
  return request<ContentItem[]>("/content");
}

export function fetchEvents() {
  return request<EventItem[]>("/events");
}