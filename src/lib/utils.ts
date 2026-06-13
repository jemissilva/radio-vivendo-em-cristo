export const nowIso = () => new Date().toISOString();

export const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const sortByDateDesc = <T>(items: T[], selector: (item: T) => string) =>
  [...items].sort(
    (left, right) =>
      new Date(selector(right)).getTime() - new Date(selector(left)).getTime(),
  );