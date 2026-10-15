/**
 * Organising team. Add `photo: "/team/<file>.webp"` (put the file in public/team/)
 * to swap a monogram placeholder for a portrait.
 *
 * TEDx rules: the licensee and organisers are the sole organisers of the event, and
 * no team member may also be a speaker or a sponsor of this event.
 */
export type Member = { name: string; role?: string; photo?: string };

export const coreLeadership: Member[] = [
  { name: "Dhruvi Namdeo", role: "Organiser & Curator" },
  { name: "Nishita Raghavendra", role: "Organiser & Curator" },
  { name: "Suyash Vasal Jain", role: "Executive Producer" },
  { name: "Medhansh Rathod", role: "Sponsorship & Budget Manager" },
];

export const teams: { name: string; members: Member[] }[] = [
  {
    name: "Curator Team",
    members: [{ name: "Yash Upadhyay" }, { name: "Twinkle Ramchandani" }, { name: "Prashasti Verma" }],
  },
  {
    name: "Communication, Editorial & Marketing",
    members: [{ name: "Twinkle Ramchandani" }, { name: "Garima Tilwankar" }, { name: "Tanishka Gupta" }],
  },
  {
    name: "Video Production & Design",
    members: [{ name: "Nishita Raghavendra" }, { name: "Dhruvi Namdeo" }],
  },
  {
    name: "Design, AV & Production",
    members: [{ name: "Dhruvi Namdeo" }, { name: "Nishita Raghavendra" }],
  },
  { name: "Event Manager", members: [{ name: "Priyal Agrawal" }] },
  { name: "Website Manager", members: [{ name: "Yash Upadhyay" }, { name: "Suyash Vasal Jain" }] },
];
