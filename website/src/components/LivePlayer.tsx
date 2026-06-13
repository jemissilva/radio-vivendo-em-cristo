import type { StreamStatus } from "../types";

interface LivePlayerProps {
  live: StreamStatus;
}

export function LivePlayer({ live }: LivePlayerProps) {
  return (
    <section className="live-player card" id="ao-vivo">
      <div>
        <p className={`badge ${live.isLive ? "badge-live" : "badge-offline"}`}>
          {live.isLive ? "No ar agora" : "Transmissão indisponível"}
        </p>
        <h3>{live.currentTrack}</h3>
        <p>
          Ouça a programação oficial da Rádio Web Igreja Vivendo em Cristo com palavra,
          louvor e oração durante todo o dia.
        </p>
        <div className="live-stats">
          <div>
            <strong>{live.listenersNow}</strong>
            <span>ouvintes</span>
          </div>
          <div>
            <strong>{live.bitrateKbps} kbps</strong>
            <span>qualidade</span>
          </div>
        </div>
      </div>
      <div className="player-box">
        <audio controls preload="none" src={live.streamUrl}>
          Seu navegador não suporta áudio HTML5.
        </audio>
        <a className="button button-secondary" href={live.streamUrl} target="_blank" rel="noreferrer">
          Abrir stream direto
        </a>
      </div>
    </section>
  );
}