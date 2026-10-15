/**
 * Organising team. Add `photo: "/team/<file>.webp"` (put the file in public/team/)
 * to swap a monogram placeholder for a portrait.
 *
 * TEDx rules: the licensee and organisers are the sole organisers of the event, and
 * no team member may also be a speaker or a sponsor of this event.
 */
export type Member = { name: string; role?: string; photo?: string };

export const coreLeadership: Member[] = [
  { name: "Dhruvi Namdeo", role: "Organiser" },
  { name: "Nishita Raghavendra", role: "Organiser" },
  { name: "Suyash Vasal Jain", role: "Executive Producer" },
  { name: "Medhansh Rathod", role: "Sponsorship & Budget Manager" },
];

export const teams: { name: string; members: Member[] }[] = [
  {
    name: "Curator Team",
    members: [{ name: "Yash Upadhyay" }, { name: "Twinkle Ramchandani" }],
  },
  {
    name: "Communication, Editorial & Marketing",
    members: [{ name: "Garima Tilwankar" }, { name: "Tanishka Gupta" }],
  },
  { name: "Event Manager", members: [{ name: "Priyal Agrawal" }] },
  { name: "Website Manager", members: [{ name: "Yash Upadhyay" }] },
];
