import { formatDuration, formatShortDate, getFeaturedContent, getTypeLabel } from "../lib/content";
import type { ContentItem } from "../types";
import { SectionTitle } from "./SectionTitle";

interface ContentSectionProps {
  items: ContentItem[];
}

export function ContentSection({ items }: ContentSectionProps) {
  const featured = getFeaturedContent(items);

  return (
    <section id="conteudos" className="section">
      <SectionTitle
        eyebrow="Conteúdos"
        title="Mensagens e louvores para ouvir quando quiser"
        description="Acesse pregações, devocionais, podcasts e conteúdos especiais publicados pela igreja."
      />
      <div className="grid cards-grid">
        {featured.map((item) => (
          <article key={item.id} className="card content-card">
            <div className="content-meta">
              <span className="badge">{getTypeLabel(item.type)}</span>
              <span>{formatDuration(item.durationSeconds)}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="tags">
              {item.categories.map((category) => (
                <span key={category.id}>{category.name}</span>
              ))}
            </div>
            <dl>
              <div>
                <dt>Autor</dt>
                <dd>{item.author}</dd>
              </div>
              <div>
                <dt>Publicado</dt>
                <dd>{item.publishedAt ? formatShortDate(item.publishedAt) : "Em breve"}</dd>
              </div>
            </dl>
            <a className="button button-secondary" href={item.audioUrl} target="_blank" rel="noreferrer">
              Ouvir conteúdo
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}