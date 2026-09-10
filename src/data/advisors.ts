import advisor1 from "@/assets/advisor-1.jpg";
import advisor2 from "@/assets/advisor-2.jpg";
import advisor3 from "@/assets/advisor-3.jpg";
import advisor4 from "@/assets/advisor-4.jpg";

export type BadgeTag = "NEW" | "RISING STAR" | "TOP RATED";
export type ReadingType = "Chat" | "Call" | "Video";

export type Advisor = {
  id: string;
  name: string;
  photo: string;
  headline: string;
  category: string;
  skills: string[];
  online: boolean;
  rating: number;
  reviews: number;
  pricePerMin: number;
  readingTypes: ReadingType[];
  badge?: BadgeTag;
  matchScore?: number;
};

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

export const favoriteAdvisors = [advisors[0], advisors[2]];
export const smartMatches = advisors;
