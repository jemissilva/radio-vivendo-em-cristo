import { hashPassword } from "./auth";
import { createId, nowIso, slugify } from "./utils";
import {
  AdminUser,
  AnalyticsSnapshot,
  Banner,
  Category,
  ContactMessage,
  ContentItem,
  EventItem,
  PrayerRequest,
  Program,
  ScheduleEntry,
  StreamStatus,
} from "../types";

export interface Database {
  adminUsers: AdminUser[];
  programs: Program[];
  scheduleEntries: ScheduleEntry[];
  categories: Category[];
  contentItems: ContentItem[];
  events: EventItem[];
  banners: Banner[];
  contactMessages: ContactMessage[];
  prayerRequests: PrayerRequest[];
  streamStatus: StreamStatus;
  analytics: AnalyticsSnapshot;
}

const buildSeed = async (): Promise<Database> => {
  const timestamp = nowIso();
  const adminId = createId("admin");
  const morningProgramId = createId("program");
  const nightProgramId = createId("program");
  const categoryPregacaoId = createId("category");
  const categoryLouvorId = createId("category");
  const contentOneId = createId("content");
  const contentTwoId = createId("content");

  return {
    adminUsers: [
      {
        id: adminId,
        name: "Administrador Geral",
        email: "admin@vivendoemcristo.org",
        passwordHash: await hashPassword("Admin@123"),
        role: "admin",
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    programs: [
      {
        id: morningProgramId,
        name: "Manhã com Cristo",
        slug: slugify("Manhã com Cristo"),
        description: "Programa matinal com oração, palavra e louvores.",
        hostName: "Pr. João",
        active: true,
        coverImageUrl: "https://example.com/images/programa-manha.jpg",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: nightProgramId,
        name: "Noite de Adoração",
        slug: slugify("Noite de Adoração"),
        description: "Louvores e mensagens edificantes para o período noturno.",
        hostName: "Equipe de Louvor",
        active: true,
        coverImageUrl: "https://example.com/images/programa-noite.jpg",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    scheduleEntries: [
      {
        id: createId("schedule"),
        programId: morningProgramId,
        dayOfWeek: 1,
        startTime: "06:00",
        endTime: "08:00",
        isLive: true,
        notes: "Ao vivo do estúdio principal",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: createId("schedule"),
        programId: nightProgramId,
        dayOfWeek: 5,
        startTime: "20:00",
        endTime: "22:00",
        isLive: true,
        notes: "Especial de sexta-feira",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    categories: [
      {
        id: categoryPregacaoId,
        name: "Pregações",
        slug: slugify("Pregações"),
      },
      {
        id: categoryLouvorId,
        name: "Louvores",
        slug: slugify("Louvores"),
      },
    ],
    contentItems: [
      {
        id: contentOneId,
        title: "A força da oração",
        slug: slugify("A força da oração"),
        description: "Mensagem sobre perseverança em oração.",
        type: "pregacao",
        author: "Pr. João",
        audioUrl: "https://example.com/audio/forca-da-oracao.mp3",
        imageUrl: "https://example.com/images/forca-da-oracao.jpg",
        durationSeconds: 2400,
        publishedAt: timestamp,
        status: "published",
        categoryIds: [categoryPregacaoId],
        programId: morningProgramId,
        tags: ["oração", "fé"],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: contentTwoId,
        title: "Adoração que transforma",
        slug: slugify("Adoração que transforma"),
        description: "Seleção especial de louvores congregacionais.",
        type: "louvor",
        author: "Equipe de Louvor",
        audioUrl: "https://example.com/audio/adoracao-que-transforma.mp3",
        imageUrl: "https://example.com/images/adoracao-que-transforma.jpg",
        durationSeconds: 1800,
        publishedAt: timestamp,
        status: "published",
        categoryIds: [categoryLouvorId],
        programId: nightProgramId,
        tags: ["adoração", "louvor"],
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    events: [
      {
        id: createId("event"),
        title: "Vigília de Oração",
        slug: slugify("Vigília de Oração"),
        description: "Uma noite de clamor e intercessão.",
        location: "Templo sede",
        startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        bannerImageUrl: "https://example.com/images/vigilia.jpg",
        externalUrl: "https://example.com/eventos/vigilia",
        published: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    banners: [
      {
        id: createId("banner"),
        title: "Campanha da Família",
        imageUrl: "https://example.com/images/banner-familia.jpg",
        linkUrl: "https://example.com/campanhas/familia",
        active: true,
        priority: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    contactMessages: [],
    prayerRequests: [],
    streamStatus: {
      isLive: true,
      streamUrl: "https://stream.example.com/live",
      fallbackUrl: "https://stream.example.com/fallback",
      currentTrack: "Ao Vivo - Igreja Vivendo em Cristo",
      bitrateKbps: 128,
      listenersNow: 42,
      updatedAt: timestamp,
    },
    analytics: {
      listenersNow: 42,
      peakListenersToday: 118,
      averageSessionMinutes: 23,
      topContentIds: [contentOneId, contentTwoId],
      contactMessagesToday: 0,
      prayerRequestsToday: 0,
      streamUptimePercent: 99.8,
    },
  };
};

let databasePromise: Promise<Database> | null = null;

export const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = buildSeed();
  }
  return databasePromise;
};