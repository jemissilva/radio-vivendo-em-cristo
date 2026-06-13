import type { Program } from "../types";
import { SectionTitle } from "./SectionTitle";

interface ProgramsSectionProps {
  programs: Program[];
}

export function ProgramsSection({ programs }: ProgramsSectionProps) {
  return (
    <section id="programas" className="section">
      <SectionTitle
        eyebrow="Programas"
        title="Conheça a nossa grade ministerial"
        description="Programas ao vivo e especiais com mensagens, louvores e direção espiritual para toda a família."
      />
      <div className="grid cards-grid">
        {programs.map((program) => (
          <article key={program.id} className="card program-card">
            <div className="program-cover">
              <span>{program.name.slice(0, 1)}</span>
            </div>
            <h3>{program.name}</h3>
            <p>{program.description}</p>
            <dl>
              <div>
                <dt>Apresentação</dt>
                <dd>{program.hostName}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{program.active ? "Ativo" : "Inativo"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}