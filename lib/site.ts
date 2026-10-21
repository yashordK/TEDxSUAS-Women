/**
 * Event facts. Single source of truth: every component reads from here.
 * Do not invent details; update this file when organisers confirm anything new.
 */
export const site = {
  name: "TEDxSUAS Women",
  shortName: "TEDxSUAS Women",
  disclaimer: "x = independently organized TED event",
  license: "This independent TEDx event is operated under license from TED.",

  theme: {
    devanagari: "त्वमेव परिवर्तनम्",
    transliteration: "Tvamev Parivartanam",
    meaning: "You are the change.",
    tagline: "It begins with you",
  },

  date: {
    iso: "2027-02-04",
    display: "04 February 2027",
  },

  venue: {
    name: "Symbiosis University of Applied Sciences",
    city: "Indore",
    display: "Symbiosis University of Applied Sciences, Indore",
    address: [
      "Super Corridor, Near Airport",
      "Bada Bangarda, Indore",
      "Madhya Pradesh 453112",
    ],
    mapQuery: "Symbiosis University of Applied Sciences, Super Corridor, Indore",
    website: "https://www.suas.ac.in",
  },

  // TEDxSUAS reel shown in the About section until we have our own film.
  featuredReel: "https://www.instagram.com/reel/Dedt41Fonyq/",

  pillars: ["Speak", "Change", "Inspire"] as const,

  lines: {
    ideas: "Ideas Worth Spreading",
    thoughts: "Thoughts. Voices. Change.",
    tomorrow: "A larger tomorrow, together.",
  },

  organisers: [
    { name: "Nishita Raghavendra", email: "nishitaraghvendra@gmail.com" },
    { name: "Dhruvi Namdeo", email: "dhruvinamdeo@gmail.com" },
  ],

  // Placeholder social links: replace before launch.
  socials: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
  ],

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const nav = [
  { label: "Theme", href: "/#theme" },
  { label: "About", href: "/#about" },
  { label: "Speakers", href: "/#speakers" },
  { label: "Team", href: "/#team" },
  { label: "Venue", href: "/#venue" },
] as const;
