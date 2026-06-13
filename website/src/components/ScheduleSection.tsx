import { groupSchedule } from "../lib/content";
import type { ScheduleEntry } from "../types";
import { SectionTitle } from "./SectionTitle";

interface ScheduleSectionProps {
  schedule: ScheduleEntry[];
}

export function ScheduleSection({ schedule }: ScheduleSectionProps) {
  const grouped = groupSchedule(schedule);

  return (
    <section id="programacao" className="section">
      <SectionTitle
        eyebrow="Programação"
        title="Acompanhe a programação semanal"
        description="Veja os horários dos programas e acompanhe os momentos ao vivo da rádio."
      />
      <div className="schedule-grid">
        {grouped.map(({ day, entries }) => (
          <article key={day} className="card schedule-day">
            <h3>{day}</h3>
            {entries.length === 0 ? (
              <p className="muted">Sem programação cadastrada.</p>
            ) : (
              <ul>
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <strong>
                      {entry.startTime} - {entry.endTime}
                    </strong>
                    <span>{entry.program?.name ?? "Programa não encontrado"}</span>
                    <small>
                      {entry.isLive ? "Ao vivo" : "Gravado"}
                      {entry.notes ? ` • ${entry.notes}` : ""}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}