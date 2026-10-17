/**
 * Organising team. Add `photo: "/team/<file>.webp"` (put the file in public/team/)
 * to swap a monogram placeholder for a portrait.
 *
 * TEDx rules: the licensee and organisers are the sole organisers of the event, and
 * no team member may also be a speaker or a sponsor of this event.
 */
export type Team = "Curation" | "Communication" | "Events" | "Website";

/** A person on the site. `photo` is a path under public/team/ (e.g. "/team/yash-upadhyay.webp"). */
export type Person = {
  name: string;
  roles: string[];
  teams?: Team[];
  photo?: string;
  instagram?: string;
  linkedin?: string;
};

/** The four leads, shown large at the top of /team. */
export const coreLeadership: Person[] = [
  { name: "Dhruvi Namdeo", roles: ["Organiser"] },
  { name: "Nishita Raghavendra", roles: ["Organiser"] },
  { name: "Suyash Vasal Jain", roles: ["Executive Producer"] },
  { name: "Medhansh Rathod", roles: ["Sponsorship & Budget Manager"] },
];

/** The crew: each person once, with every role and team they belong to. */
export const people: Person[] = [
  { name: "Yash Upadhyay", roles: ["Curator", "Website Manager"], teams: ["Curation", "Website"] },
  { name: "Twinkle Ramchandani", roles: ["Curator"], teams: ["Curation"] },
  { name: "Garima Tilwankar", roles: ["Communication, Editorial & Marketing"], teams: ["Communication"] },
  { name: "Tanishka Gupta", roles: ["Communication, Editorial & Marketing"], teams: ["Communication"] },
  { name: "Priyal Agrawal", roles: ["Event Manager"], teams: ["Events"] },
];
