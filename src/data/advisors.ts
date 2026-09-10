import advisor1 from "@/assets/advisor-1.jpg";
import advisor2 from "@/assets/advisor-2.jpg";
import advisor3 from "@/assets/advisor-3.jpg";
import advisor4 from "@/assets/advisor-4.jpg";

export type BadgeTag = "NEW" | "RISING STAR" | "TOP RATED";
export type ReadingType = "Chat" | "Call" | "Video";

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type AdvisorStatus = "AVAILABLE" | "OFFLINE" | "ON A BREAK";

export type Advisor = {
  id: string;
  name: string;
  photo: string;
  headline: string;
  tagline?: string;
  readings?: number;
  since?: number;
  listPrice?: number;
  status?: AdvisorStatus;
  category: string;
  skills: string[];
  online: boolean;
  busy?: boolean;
  rating: number;
  reviews: number;
  pricePerMin: number;
  readingTypes: ReadingType[];
  badge?: BadgeTag;
  matchScore?: number;
  languages?: string[];
  experienceYears?: number;
  bio?: string;
  audioBioSeconds?: number;
  schedule?: { day: string; hours: string; available: boolean }[];
  reviewList?: Review[];
};


const defaultSchedule = [
  { day: "Monday", hours: "9:00 AM – 6:00 PM", available: true },
  { day: "Tuesday", hours: "9:00 AM – 6:00 PM", available: true },
  { day: "Wednesday", hours: "12:00 PM – 9:00 PM", available: true },
  { day: "Thursday", hours: "9:00 AM – 4:00 PM", available: true },
  { day: "Friday", hours: "10:00 AM – 8:00 PM", available: true },
  { day: "Saturday", hours: "By appointment", available: true },
  { day: "Sunday", hours: "Unavailable", available: false },
];

const sampleReviews = (name: string): Review[] => [
  {
    id: "r1",
    author: "Amelia R.",
    rating: 5,
    date: "3 days ago",
    text: `${name} was calm, direct and did not sugarcoat anything. The timing they gave me lined up almost exactly with what happened this week.`,
  },
  {
    id: "r2",
    author: "Jordan K.",
    rating: 5,
    date: "1 week ago",
    text: "Second reading with them and both times I left with a concrete next step rather than vague comfort. Worth every credit.",
  },
  {
    id: "r3",
    author: "Priya S.",
    rating: 4,
    date: "2 weeks ago",
    text: "Very warm and easy to talk to. I would have liked a little more detail on the career side, but the relationship read was spot on.",
  },
  {
    id: "r4",
    author: "Tomas L.",
    rating: 5,
    date: "1 month ago",
    text: "Picked up on things I never mentioned. The chat session went fast and I re-read the transcript twice.",
  },
];


export const categories = [
  "Tarot",
  "Love & Relationships",
  "Career",
  "Astrology",
  "Dream Analysis",
  "Mediumship",
  "Numerology",
  "Spiritual Healing",
];

export const advisors: Advisor[] = [
  {
    id: "a1",
    name: "Selene Marlowe",
    photo: advisor1,
    headline: "Tarot reader focused on relationship clarity",
    category: "Tarot",
    skills: ["Tarot", "Love & Relationships"],
    online: true,
    rating: 4.9,
    reviews: 2318,
    pricePerMin: 4.99,
    readingTypes: ["Chat", "Call"],
    badge: "TOP RATED",
    matchScore: 96,
  },
  {
    id: "a2",
    name: "Idris Vale",
    photo: advisor2,
    headline: "Clairvoyant guidance for career crossroads",
    category: "Career",
    skills: ["Career", "Mediumship"],
    online: false,
    rating: 4.8,
    reviews: 1104,
    pricePerMin: 6.5,
    readingTypes: ["Call", "Video"],
    badge: "RISING STAR",
    matchScore: 91,
  },
  {
    id: "a3",
    name: "Nadia Okonkwo",
    photo: advisor3,
    headline: "Astrologer mapping life path and timing",
    category: "Astrology",
    skills: ["Astrology", "Numerology"],
    online: true,
    busy: true,

    rating: 5,
    reviews: 876,
    pricePerMin: 3.75,
    readingTypes: ["Chat", "Video"],
    badge: "TOP RATED",
    matchScore: 89,
  },
  {
    id: "a4",
    name: "Marek Sol",
    photo: advisor4,
    headline: "Dream analysis and intuitive energy work",
    category: "Dream Analysis",
    skills: ["Dream Analysis", "Spiritual Healing"],
    online: true,
    rating: 4.6,
    reviews: 143,
    pricePerMin: 2.99,
    readingTypes: ["Chat"],
    badge: "NEW",
    matchScore: 84,
  },
];

for (const a of advisors) {
  a.languages ??= ["English", "Spanish"];
  a.experienceYears ??= 8 + (a.reviews % 11);
  a.audioBioSeconds ??= 38 + (a.reviews % 25);
  a.schedule ??= defaultSchedule;
  a.reviewList ??= sampleReviews(a.name);
  a.bio ??= `${a.name} has spent ${a.experienceYears} years reading for people at turning points — ${a.headline.toLowerCase()}. Sessions are grounded and practical: expect clear timing, honest answers, and a next step you can actually take. Every reading starts with a short check-in so the guidance lands on what you actually came for, whether that is ${a.skills.join(" or ").toLowerCase()}.`;
}

export function getAdvisor(id: string): Advisor | undefined {
  return advisors.find((a) => a.id === id);
}


export const favoriteAdvisors: Advisor[] = advisors.filter((a) => ["a1", "a3"].includes(a.id));
export const smartMatches: Advisor[] = advisors;
