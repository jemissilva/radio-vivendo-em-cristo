import type { ContentItem, EventItem, ScheduleEntry } from "../types";

export const dayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export function groupSchedule(entries: ScheduleEntry[]) {
  return dayNames.map((day, index) => ({
    day,
    entries: entries.filter((entry) => entry.dayOfWeek === index),
  }));
}

export function getFeaturedContent(items: ContentItem[]) {
  return items.slice(0, 3);
}

export function getUpcomingEvents(items: EventItem[]) {
  return [...items]
    .sort((first, second) => new Date(first.startAt).getTime() - new Date(second.startAt).getTime())
    .slice(0, 3);
}

export function getTypeLabel(type: ContentItem["type"]) {
  const labels: Record<ContentItem["type"], string> = {
    pregacao: "Pregação",
    devocional: "Devocional",
    louvor: "Louvor",
    podcast: "Podcast",
    programa_especial: "Programa especial",
  };
  return labels[type];
}