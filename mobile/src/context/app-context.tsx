import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { appConfig } from "@/src/config/app-config";
import { fallbackContent, fallbackEvents, fallbackLive, fallbackPrograms, fallbackSchedule } from "@/src/data/fallback-data";
import { postContactMessage, postPrayerRequest } from "@/src/services/forms-service";
import { fetchContent, fetchEvents, fetchLive, fetchPrograms, fetchSchedule } from "@/src/services/public-api";
import { ContactFormState, ContentItem, EventItem, PrayerFormState, Program, ScheduleEntry, StreamStatus } from "@/src/types";

interface AppContextValue {
  live: StreamStatus;
  programs: Program[];
  schedule: ScheduleEntry[];
  content: ContentItem[];
  events: EventItem[];
  favorites: string[];
  prayerForm: PrayerFormState;
  contactForm: ContactFormState;
  toggleFavorite: (id: string) => void;
  updatePrayerForm: (field: keyof PrayerFormState, value: string) => void;
  updateContactForm: (field: keyof ContactFormState, value: string) => void;
  submitPrayerRequest: () => Promise<{ ok: boolean; message: string }>;
  submitContactMessage: () => Promise<{ ok: boolean; message: string }>;
}

const AppContext = createContext<AppContextValue | null>(null);

const FAVORITES_KEY = "radio-vivendo-em-cristo:favorites";

export function AppProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<StreamStatus>(fallbackLive);
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(fallbackSchedule);
  const [content, setContent] = useState<ContentItem[]>(fallbackContent);
  const [events, setEvents] = useState<EventItem[]>(fallbackEvents);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [prayerForm, setPrayerForm] = useState<PrayerFormState>({ name: "", email: "", request: "" });
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const bootstrap = async () => {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      const [liveData, scheduleData, programsData, contentData, eventsData] = await Promise.all([
        fetchLive().catch(() => ({ ...fallbackLive, streamUrl: appConfig.streamUrl })),
        fetchSchedule().catch(() => fallbackSchedule),
        fetchPrograms().catch(() => fallbackPrograms),
        fetchContent().catch(() => fallbackContent),
        fetchEvents().catch(() => fallbackEvents),
      ]);

      setLive({ ...liveData, streamUrl: liveData.streamUrl || appConfig.streamUrl });
      setSchedule(scheduleData);
      setPrograms(programsData);
      setContent(contentData);
      setEvents(eventsData);
    };

    void bootstrap();
  }, []);

  const toggleFavorite = async (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((favoriteId) => favoriteId !== id)
      : [...favorites, id];
    setFavorites(next);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const updatePrayerForm = (field: keyof PrayerFormState, value: string) => {
    setPrayerForm((current) => ({ ...current, [field]: value }));
  };

  const updateContactForm = (field: keyof ContactFormState, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
  };

  const submitPrayerRequest = async () => {
    if (!prayerForm.name || !prayerForm.request) {
      return { ok: false, message: "Preencha nome e pedido de oração." };
    }

    try {
      await postPrayerRequest(prayerForm);
      setPrayerForm({ name: "", email: "", request: "" });
      return { ok: true, message: "Seu pedido foi enviado com sucesso." };
    } catch {
      return { ok: false, message: "Não foi possível enviar agora." };
    }
  };

  const submitContactMessage = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      return { ok: false, message: "Preencha todos os campos do contato." };
    }

    try {
      await postContactMessage(contactForm);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      return { ok: true, message: "Sua mensagem foi enviada com sucesso." };
    } catch {
      return { ok: false, message: "Não foi possível enviar sua mensagem." };
    }
  };

  const value = useMemo<AppContextValue>(
    () => ({
      live,
      programs,
      schedule,
      content,
      events,
      favorites,
      prayerForm,
      contactForm,
      toggleFavorite,
      updatePrayerForm,
      updateContactForm,
      submitPrayerRequest,
      submitContactMessage,
    }),
    [live, programs, schedule, content, events, favorites, prayerForm, contactForm],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppProvider.");
  }
  return context;
}