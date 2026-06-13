import { useCallback } from "react";
import { ContentSection } from "./components/ContentSection";
import { ContactSection } from "./components/ContactSection";
import { EventsSection } from "./components/EventsSection";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LivePlayer } from "./components/LivePlayer";
import { PrayerSection } from "./components/PrayerSection";
import { ProgramsSection } from "./components/ProgramsSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { api } from "./lib/api";
import { useAsyncData } from "./hooks/useAsyncData";

function App() {
  const loadHome = useCallback(
    () =>
      Promise.all([
        api.getLive(),
        api.getPrograms(),
        api.getSchedule(),
        api.getContent(),
        api.getEvents(),
      ]).then(([live, programs, schedule, content, events]) => ({
        live,
        programs,
        schedule,
        content,
        events,
      })),
    [],
  );

  const { data, loading, error } = useAsyncData(loadHome);

  if (loading) {
    return <div className="screen-state">Carregando o site oficial da rádio...</div>;
  }

  if (error || !data) {
    return (
      <div className="screen-state error-state">
        <h1>Não foi possível carregar o site</h1>
        <p>{error ?? "Erro desconhecido"}</p>
        <p>Verifique se a API backend está online e se `VITE_API_BASE_URL` está configurada corretamente.</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">▶</span>
          <span>Vivendo em Cristo</span>
        </a>
        <nav>
          <a href="#programas">Programas</a>
          <a href="#programacao">Programação</a>
          <a href="#conteudos">Conteúdos</a>
          <a href="#eventos">Eventos</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main className="container">
        <Hero live={data.live} />
        <LivePlayer live={data.live} />
        <ProgramsSection programs={data.programs} />
        <ScheduleSection schedule={data.schedule} />
        <ContentSection items={data.content} />
        <EventsSection events={data.events} />
        <PrayerSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;