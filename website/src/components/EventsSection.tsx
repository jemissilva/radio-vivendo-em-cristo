import { formatDate, getUpcomingEvents } from "../lib/content";
import type { EventItem } from "../types";
import { SectionTitle } from "./SectionTitle";

interface EventsSectionProps {
  events: EventItem[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const upcoming = getUpcomingEvents(events);

  return (
    <section id="eventos" className="section">
      <SectionTitle
        eyebrow="Eventos"
        title="Campanhas, vigílias e encontros especiais"
        description="Fique por dentro dos próximos eventos da Igreja Vivendo em Cristo e participe conosco."
      />
      <div className="grid cards-grid">
        {upcoming.map((event) => (
          <article key={event.id} className="card event-card">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <dl>
              <div>
                <dt>Data</dt>
                <dd>{formatDate(event.startAt)}</dd>
              </div>
              <div>
                <dt>Local</dt>
                <dd>{event.location ?? "A confirmar"}</dd>
              </div>
            </dl>
            {event.externalUrl ? (
              <a className="button button-secondary" href={event.externalUrl} target="_blank" rel="noreferrer">
                Ver detalhes
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}