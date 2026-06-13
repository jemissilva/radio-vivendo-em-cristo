import { comparePassword, signAdminToken } from "../lib/auth";
import { AppError } from "../lib/errors";
import { getDatabase } from "../lib/store";
import { createId, nowIso, slugify } from "../lib/utils";
import {
  Banner,
  ContactMessage,
  ContentItem,
  EventItem,
  PrayerRequest,
  Program,
  ScheduleEntry,
} from "../types";

export const loginAdmin = async (email: string, password: string) => {
  const database = await getDatabase();
  const user = database.adminUsers.find((item) => item.email === email && item.active);
  if (!user) {
    throw new AppError(401, "Credenciais inválidas");
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, "Credenciais inválidas");
  }

  return {
    token: signAdminToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getDashboardPayload = async () => {
  const database = await getDatabase();
  return {
    analytics: database.analytics,
    totals: {
      programs: database.programs.length,
      scheduleEntries: database.scheduleEntries.length,
      contentItems: database.contentItems.length,
      events: database.events.length,
      banners: database.banners.length,
      contactMessages: database.contactMessages.length,
      prayerRequests: database.prayerRequests.length,
    },
    latestMessages: database.contactMessages.slice(-5).reverse(),
    latestPrayerRequests: database.prayerRequests.slice(-5).reverse(),
  };
};

export const listPrograms = async () => (await getDatabase()).programs;

export const createProgram = async (input: Omit<Program, "id" | "slug" | "createdAt" | "updatedAt">) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const program: Program = {
    id: createId("program"),
    slug: slugify(input.name),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.programs.push(program);
  return program;
};

export const updateProgram = async (
  id: string,
  input: Partial<Omit<Program, "id" | "slug" | "createdAt" | "updatedAt">>,
) => {
  const database = await getDatabase();
  const program = database.programs.find((item) => item.id === id);
  if (!program) {
    throw new AppError(404, "Programa não encontrado");
  }
  Object.assign(program, input, {
    slug: input.name ? slugify(input.name) : program.slug,
    updatedAt: nowIso(),
  });
  return program;
};

export const deleteProgram = async (id: string) => {
  const database = await getDatabase();
  const index = database.programs.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError(404, "Programa não encontrado");
  }
  database.programs.splice(index, 1);
};

export const listSchedule = async () => (await getDatabase()).scheduleEntries;

export const createScheduleEntry = async (
  input: Omit<ScheduleEntry, "id" | "createdAt" | "updatedAt">,
) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const entry: ScheduleEntry = {
    id: createId("schedule"),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.scheduleEntries.push(entry);
  return entry;
};

export const updateScheduleEntry = async (
  id: string,
  input: Partial<Omit<ScheduleEntry, "id" | "createdAt" | "updatedAt">>,
) => {
  const database = await getDatabase();
  const entry = database.scheduleEntries.find((item) => item.id === id);
  if (!entry) {
    throw new AppError(404, "Horário não encontrado");
  }
  Object.assign(entry, input, { updatedAt: nowIso() });
  return entry;
};

export const deleteScheduleEntry = async (id: string) => {
  const database = await getDatabase();
  const index = database.scheduleEntries.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError(404, "Horário não encontrado");
  }
  database.scheduleEntries.splice(index, 1);
};

export const listContent = async () => (await getDatabase()).contentItems;

export const createContent = async (
  input: Omit<ContentItem, "id" | "slug" | "createdAt" | "updatedAt">,
) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const item: ContentItem = {
    id: createId("content"),
    slug: slugify(input.title),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.contentItems.push(item);
  return item;
};

export const updateContent = async (
  id: string,
  input: Partial<Omit<ContentItem, "id" | "slug" | "createdAt" | "updatedAt">>,
) => {
  const database = await getDatabase();
  const item = database.contentItems.find((content) => content.id === id);
  if (!item) {
    throw new AppError(404, "Conteúdo não encontrado");
  }
  Object.assign(item, input, {
    slug: input.title ? slugify(input.title) : item.slug,
    updatedAt: nowIso(),
  });
  return item;
};

export const deleteContent = async (id: string) => {
  const database = await getDatabase();
  const index = database.contentItems.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError(404, "Conteúdo não encontrado");
  }
  database.contentItems.splice(index, 1);
};

export const listEvents = async () => (await getDatabase()).events;

export const createEvent = async (
  input: Omit<EventItem, "id" | "slug" | "createdAt" | "updatedAt">,
) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const event: EventItem = {
    id: createId("event"),
    slug: slugify(input.title),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.events.push(event);
  return event;
};

export const updateEvent = async (
  id: string,
  input: Partial<Omit<EventItem, "id" | "slug" | "createdAt" | "updatedAt">>,
) => {
  const database = await getDatabase();
  const event = database.events.find((item) => item.id === id);
  if (!event) {
    throw new AppError(404, "Evento não encontrado");
  }
  Object.assign(event, input, {
    slug: input.title ? slugify(input.title) : event.slug,
    updatedAt: nowIso(),
  });
  return event;
};

export const deleteEvent = async (id: string) => {
  const database = await getDatabase();
  const index = database.events.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError(404, "Evento não encontrado");
  }
  database.events.splice(index, 1);
};

export const listBanners = async () => (await getDatabase()).banners;

export const createBanner = async (
  input: Omit<Banner, "id" | "createdAt" | "updatedAt">,
) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const banner: Banner = {
    id: createId("banner"),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.banners.push(banner);
  return banner;
};

export const updateBanner = async (
  id: string,
  input: Partial<Omit<Banner, "id" | "createdAt" | "updatedAt">>,
) => {
  const database = await getDatabase();
  const banner = database.banners.find((item) => item.id === id);
  if (!banner) {
    throw new AppError(404, "Banner não encontrado");
  }
  Object.assign(banner, input, { updatedAt: nowIso() });
  return banner;
};

export const deleteBanner = async (id: string) => {
  const database = await getDatabase();
  const index = database.banners.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError(404, "Banner não encontrado");
  }
  database.banners.splice(index, 1);
};

export const listMessages = async () => (await getDatabase()).contactMessages;

export const updateMessageStatus = async (
  id: string,
  input: Partial<Pick<ContactMessage, "status" | "classification">>,
) => {
  const database = await getDatabase();
  const message = database.contactMessages.find((item) => item.id === id);
  if (!message) {
    throw new AppError(404, "Mensagem não encontrada");
  }
  Object.assign(message, input, { updatedAt: nowIso() });
  return message;
};

export const listPrayerRequests = async () => (await getDatabase()).prayerRequests;

export const updatePrayerRequestStatus = async (
  id: string,
  input: Partial<Pick<PrayerRequest, "status" | "assignedTo">>,
) => {
  const database = await getDatabase();
  const request = database.prayerRequests.find((item) => item.id === id);
  if (!request) {
    throw new AppError(404, "Pedido de oração não encontrado");
  }
  Object.assign(request, input, { updatedAt: nowIso() });
  return request;
};

export const createContactMessage = async (
  input: Omit<ContactMessage, "id" | "status" | "createdAt" | "updatedAt">,
) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const message: ContactMessage = {
    id: createId("message"),
    status: "new",
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.contactMessages.push(message);
  database.analytics.contactMessagesToday += 1;
  return message;
};

export const createPrayerRequest = async (
  input: Omit<PrayerRequest, "id" | "status" | "createdAt" | "updatedAt">,
) => {
  const database = await getDatabase();
  const timestamp = nowIso();
  const request: PrayerRequest = {
    id: createId("prayer"),
    status: "new",
    createdAt: timestamp,
    updatedAt: timestamp,
    ...input,
  };
  database.prayerRequests.push(request);
  database.analytics.prayerRequestsToday += 1;
  return request;
};