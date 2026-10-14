/**
 * Speaker lineup. While this is empty, the site shows "To be revealed" tiles and
 * /speakers shows the coming-soon page. To announce speakers, add entries:
 *   { name, title, photo: "/speakers/<file>.webp", talk?: "Talk title", bio?: "..." }
 */
export type Speaker = {
  name: string;
  title: string;
  photo?: string;
  talk?: string;
  bio?: string;
};

export const speakers: Speaker[] = [];

/** Number of placeholder tiles shown before the reveal. */
export const placeholderCount = 6;
