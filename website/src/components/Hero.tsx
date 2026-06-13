import type { StreamStatus } from "../types";

interface HeroProps {
  live: StreamStatus;
}

export function Hero({ live }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Site oficial</p>
        <h1>Rádio Web Igreja Vivendo em Cristo</h1>
        <p className="hero-text">
          Uma plataforma completa para ouvir a transmissão ao vivo, acompanhar a
          programação, acessar mensagens edificantes e enviar seu pedido de oração.
        </p>
        <div className="hero-actions">
          <a className="button" href="#ao-vivo">
            Ouvir agora
          </a>
          <a className="button button-secondary" href="#oracao">
            Pedir oração
          </a>
        </div>
        <ul className="hero-highlights">
          <li>{live.isLive ? "Transmissão ao vivo ativa" : "Programação disponível 24h"}</li>
          <li>Conteúdos sob demanda</li>
          <li>Eventos e campanhas da igreja</li>
        </ul>
      </div>
      <div className="hero-panel card">
        <div className="signal">
          <span className={live.isLive ? "signal-dot live" : "signal-dot"} />
          <span>{live.isLive ? "Ao vivo" : "Offline"}</span>
        </div>
        <h3>{live.currentTrack}</h3>
        <p>Atualizado em {new Intl.DateTimeFormat("pt-BR", { timeStyle: "short", dateStyle: "short" }).format(new Date(live.updatedAt))}</p>
        <div className="hero-metrics">
          <div>
            <strong>{live.listenersNow}</strong>
            <span>ouvintes agora</span>
          </div>
          <div>
            <strong>{live.bitrateKbps}</strong>
            <span>kbps</span>
          </div>
        </div>
      </div>
    </section>
  );
}