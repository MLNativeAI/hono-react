export function generateId(prefix: string): string {
  const uuid = crypto.randomUUID();
  const shortId = uuid.replace(/-/g, "").substring(0, 12);
  return `${prefix}_${shortId}`;
}

export const ID_PREFIXES = {
  file: "file",
  workflow: "wkf",
  workflowExecution: "exe",
  workflowFile: "wfl",
  user: "usr",
  page: "page",
  documentData: "data",
  session: "ses",
  organization: "org",
  account: "acc",
  verification: "ver",
  field: "fld",
  table: "tbl",
  column: "col",
  project: "prj",
} as const;

/**
 * Build a URL-safe, unique-ish slug from a display name.
 * A short random suffix is appended so slugs stay unique without
 * forcing the user to supply one.
 */
export function slugify(text: string): string {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}
