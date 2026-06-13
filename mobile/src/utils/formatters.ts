const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function formatDayOfWeek(dayOfWeek: number) {
  return days[dayOfWeek] ?? "Dia";
}

export function formatDuration(durationSeconds: number) {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}