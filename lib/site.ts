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
    short: "SUAS",
    city: "Indore",
    display: "Symbiosis University of Applied Sciences, Indore",
    address: [
      "Super Corridor, Near Airport",
      "Bada Bangarda, Indore",
      "Madhya Pradesh 453112",
    ],
    mapQuery: "Symbiosis University of Applied Sciences, Super Corridor, Indore",
    // Google Maps search for mapQuery. Empty string hides the "Open in Maps" link.
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Symbiosis%20University%20of%20Applied%20Sciences%2C%20Super%20Corridor%2C%20Indore",
    // Travel notes for /venue (only rendered when non-empty).
    // TODO: entry gate and parking details once confirmed by the organisers.
    notes: [
      { k: "By air", v: "The campus sits on the Super Corridor, a short drive from Devi Ahilya Bai Holkar Airport." },
      { k: "By road", v: "Cabs and autos run along the Super Corridor from across the city. Allow extra time on event morning." },
      { k: "On arrival", v: "Volunteers will guide you from the gate to registration. Keep your confirmation handy." },
    ] as { k: string; v: string }[],
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

  // Directions the lineup is being curated around (not a final programme). Shown on
  // /speakers; /speak can reuse them.
  directions: [
    { n: "01", title: "Survivor Stories", sub: "Rebuilding After Trauma", line: "Healing isn't just overcoming hardship, it's reclaiming identity, confidence and purpose." },
    { n: "02", title: "Data & Policy", sub: "State of Women Today", line: "An evidence-based look at economic participation, healthcare and representation for women." },
    { n: "03", title: "Call to Action", sub: "Everyone's Responsibility", line: "Real change starts with everyday choices, not just governments or institutions." },
    { n: "04", title: "Skills for the Digital Age", sub: "Safety as Empowerment", line: "Everyday digital safety is a skill everyone needs, not just IT experts." },
    { n: "05", title: "Women's Health", sub: "Breaking the Silence", line: "Menstrual health, reproductive health, preventive care and wellbeing." },
    { n: "06", title: "Art", sub: "Storytelling & Social Change", line: "How creative expression can shape perspectives and influence communities." },
    { n: "07", title: "Fashion", sub: "Beyond Clothing", line: "Fashion as a lens for identity, culture, confidence and innovation." },
    { n: "08", title: "Science & Innovation", sub: "Women Driving Discovery", line: "Highlighting women researchers, scientists and innovators shaping the future." },
  ],
  // Women who changed things, for /theme: the names wall uses every name; the
  // "Change always begins with one." list shows only entries with a `line`.
  // Facts to be double-checked by organisers before launch.
  changemakers: [
    { name: "Savitribai Phule", line: "Opened one of India's first schools for girls in Pune, 1848." },
    { name: "Fatima Sheikh", line: "Co-educator who opened that school in her home." },
    { name: "Anandibai Joshi", line: "One of the first Indian women to earn a Western medical degree, 1886." },
    { name: "Kalpana Chawla", line: "First woman of Indian origin in space, 1997." },
    { name: "Sarojini Naidu", line: "Poet, and the first woman governor of an Indian state." },
    { name: "Rani Lakshmibai" },
    { name: "Kamaladevi Chattopadhyay", line: "Revived India's handloom and craft traditions." },
    { name: "Rukmini Devi Arundale" },
    { name: "M. S. Subbulakshmi" },
    { name: "Mahasweta Devi" },
    { name: "Begum Rokeya" },
    { name: "Marie Curie", line: "First woman to win a Nobel Prize, and in two sciences." },
    { name: "Rosalind Franklin", line: "Her X-ray work revealed the structure of DNA." },
    { name: "Ada Lovelace", line: "Wrote the first published algorithm for a machine." },
    { name: "Florence Nightingale" },
    { name: "Wangari Maathai", line: "First African woman to win the Nobel Peace Prize, 2004." },
    { name: "Rosa Parks", line: "Refused to give up her bus seat in 1955." },
    { name: "Harriet Tubman" },
    { name: "Frida Kahlo" },
    { name: "Mother Teresa" },
  ] as { name: string; line?: string }[],

  directionTags: ["Personal stories", "Creative expression", "Scientific innovation", "Practical knowledge", "Social issues"],

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
