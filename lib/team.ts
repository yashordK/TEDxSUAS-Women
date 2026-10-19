/**
 * Organising team. Add `photo: "/team/<file>.webp"` (put the file in public/team/)
 * to swap a monogram placeholder for a portrait.
 */
export type Member = { name: string; role?: string; photo?: string };

export const coreLeadership: Member[] = [
  { name: "Dhruvi Namdeo", role: "Organiser" },
  { name: "Nishita Raghavendra", role: "Organiser" },
  { name: "Suyash Vasal Jain", role: "Executive Producer" },
  { name: "Medhansh Rathod", role: "Sponsorship & Budget Manager" },
];

export const teams: { name: string; members: Member[] }[] = [
  { name: "Curator Team", members: [{ name: "Twinkle Ramchandani" }, { name: "Yash Upadhyay" }] },
  {
    name: "Communication, Editorial & Marketing",
    members: [{ name: "Garima Tilwankar" }, { name: "Tanishka Gupta" }],
  },
  { name: "Event Manager", members: [{ name: "Priyal Agrawal" }] },
  { name: "Website Manager", members: [{ name: "Yash Upadhyay" }] },
];
