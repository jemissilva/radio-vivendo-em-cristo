import { getDatabase } from "../lib/store";
import { sortByDateDesc } from "../lib/utils";

export const getLivePayload = async () => {
  const database = await getDatabase();
  return database.streamStatus;
};

export const getSchedulePayload = async () => {
  const database = await getDatabase();
  return database.scheduleEntries.map((entry) => ({
    ...entry,
    program: database.programs.find((program) => program.id === entry.programId) ?? null,
  }));
};

export const getProgramsPayload = async () => {
  const database = await getDatabase();
  return database.programs.filter((program) => program.active);
};

export const getContentPayload = async () => {
  const database = await getDatabase();
  return sortByDateDesc(
    database.contentItems.filter((item) => item.status === "published"),
    (item) => item.publishedAt ?? item.createdAt,
  ).map((item) => ({
    ...item,
    categories: database.categories.filter((category) =>
      item.categoryIds.includes(category.id),
    ),
  }));
};

export const getContentBySlugPayload = async (slug: string) => {
  const items = await getContentPayload();
  return items.find((item) => item.slug === slug) ?? null;
};

export const getEventsPayload = async () => {
  const database = await getDatabase();
  return sortByDateDesc(
    database.events.filter((event) => event.published),
    (event) => event.startAt,
  );
};