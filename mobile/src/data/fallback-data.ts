import { ContentItem, EventItem, Program, ScheduleEntry, StreamStatus } from "@/src/types";

export const fallbackLive: StreamStatus = {
  isLive: true,
  streamUrl: "https://stream.zeno.fm/r4mpcrfwfzzuv",
  currentTrack: "Rádio Vivendo em Cristo",
  bitrateKbps: 128,
  listenersNow: 87,
  updatedAt: new Date().toISOString(),
};

export const fallbackPrograms: Program[] = [
  {
    id: "programa-manha",
    name: "Manhã com Cristo",
    slug: "manha-com-cristo",
    description: "Louvor, oração e palavra para começar o dia na presença de Deus.",
    hostName: "Equipe Vivendo em Cristo",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "programa-familia",
    name: "Família Restaurada",
    slug: "familia-restaurada",
    description: "Mensagens para fortalecer os lares e edificar relacionamentos.",
    hostName: "Pr. Ministério da Família",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fallbackSchedule: ScheduleEntry[] = [
  {
    id: "seg-1",
    programId: "programa-manha",
    dayOfWeek: 1,
    startTime: "06:00",
    endTime: "08:00",
    isLive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seg-2",
    programId: "programa-familia",
    dayOfWeek: 1,
    startTime: "19:00",
    endTime: "20:00",
    isLive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fallbackContent: ContentItem[] = [
  {
    id: "conteudo-1",
    title: "O poder da oração perseverante",
    slug: "o-poder-da-oracao-perseverante",
    description: "Uma mensagem para fortalecer sua fé e confiança no agir de Deus.",
    type: "pregacao",
    author: "Pr. João",
    audioUrl: "https://stream.zeno.fm/r4mpcrfwfzzuv",
    durationSeconds: 2480,
    status: "published",
    categoryIds: [],
    tags: ["oração", "fé"],
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "conteudo-2",
    title: "Devocional da esperança",
    slug: "devocional-da-esperanca",
    description: "Reflexão curta para renovar sua esperança em Cristo.",
    type: "devocional",
    author: "Equipe pastoral",
    audioUrl: "https://stream.zeno.fm/r4mpcrfwfzzuv",
    durationSeconds: 920,
    status: "published",
    categoryIds: [],
    tags: ["esperança"],
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fallbackEvents: EventItem[] = [
  {
    id: "evento-1",
    title: "Vigília de oração",
    slug: "vigilia-de-oracao",
    description: "Uma noite de clamor, adoração e intercessão pela igreja e famílias.",
    location: "Templo sede",
    startAt: new Date(Date.now() + 86400000).toISOString(),
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "evento-2",
    title: "Culto da família",
    slug: "culto-da-familia",
    description: "Celebração especial com palavra e ministração para toda a família.",
    location: "Auditório principal",
    startAt: new Date(Date.now() + 172800000).toISOString(),
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];