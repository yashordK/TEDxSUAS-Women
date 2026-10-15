/**
 * Event facts. Single source of truth: every component reads from here.
 * Do not invent details; update this file when organisers confirm anything new.
 */
export const site = {
  name: "TEDxSUAS Women",
  shortName: "TEDxSUAS Women",
  disclaimer: "x = independently organized TED event",
  license: "This independent TEDx event is operated under license from TED.",
  tedxUrl: "https://www.ted.com/tedx",

  // TEDx rules: the licensee and organisers are the event's sole organisers.
  // TODO: confirm the licence holder's name with the organisers; hidden while it is TODO.
  licensee: "TODO" as string,

  // The speaker application form. TODO: set the real form URL; while it is "TODO",
  // /speak shows a disabled "Applications opening soon" button.
  applyUrl: "TODO" as string,

  speakerRules:
    "TEDx speakers are not paid. Talks cannot promote the speaker's or anyone else's products, books or businesses.",

  theme: {
    devanagari: "त्वमेव परिवर्तनम्",
    transliteration: "Twamev Parivartanam",
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

  // TEDx rules: sponsors never appear on the homepage, only on /sponsors, with logos
  // smaller than the TEDx logo. TODO: add confirmed sponsors here; empty hides the page link.
  sponsors: [] as { name: string; logo: string; href?: string }[],

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const nav = [
  { label: "Theme", href: "/theme" },
  { label: "About", href: "/about" },
  { label: "Speakers", href: "/speakers" },
  { label: "Team", href: "/team" },
  { label: "Venue", href: "/venue" },
  ...(site.sponsors.length ? [{ label: "Sponsors", href: "/sponsors" }] : []),
];
