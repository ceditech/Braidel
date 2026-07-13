/* Sample marketplace data — placeholder until API routes land.
   Shared across the landing page, Find Braiders, and other screens so
   there is a single mock dataset to reason about. */

export type BraiderBadge = "Verified" | "Top rated" | "New";

export interface SampleBraider {
  id: string;
  name: string;
  city: string;
  specs: string[];
  rate: number;   // avg rating
  rev: number;    // review count
  badge: BraiderBadge;
  price: string;  // price range
  tone: number;   // Photo seed
}

export const BRAIDERS: SampleBraider[] = [
  { id: "amara", name: "Amara Okafor",  city: "Atlanta, GA",  specs: ["Knotless", "Box braids"],     rate: 4.9, rev: 128, badge: "Verified",  price: "$160–$280", tone: 0 },
  { id: "tasha", name: "Tasha Bell",    city: "Houston, TX",  specs: ["Box braids", "Feed-in"],      rate: 4.8, rev: 96,  badge: "Top rated", price: "$140–$240", tone: 1 },
  { id: "lina",  name: "Lina Mensah",   city: "Newark, NJ",   specs: ["Locs", "Faux locs"],          rate: 5.0, rev: 54,  badge: "New",       price: "$180–$320", tone: 2 },
  { id: "imani", name: "Imani Carter",  city: "Chicago, IL",  specs: ["Cornrows", "Stitch braids"],  rate: 4.9, rev: 210, badge: "Verified",  price: "$120–$220", tone: 3 },
  { id: "zola",  name: "Zola Adeyemi",  city: "Brooklyn, NY", specs: ["Senegalese twists", "Twists"],rate: 4.7, rev: 73,  badge: "Top rated", price: "$170–$300", tone: 4 },
  { id: "nia",   name: "Nia Robinson",  city: "Atlanta, GA",  specs: ["Knotless", "Goddess braids"], rate: 4.9, rev: 142, badge: "Verified",  price: "$190–$340", tone: 5 },
];

export const SPECIALTIES = [
  "Knotless",
  "Box braids",
  "Locs",
  "Cornrows",
  "Senegalese twists",
  "Feed-in",
  "Faux locs",
  "Goddess braids",
  "Stitch braids",
];

/* ── Salon-side sample data ──────────────────────────────────────── */

export type OpportunityStatus = "active" | "draft" | "closed";

export interface SampleOpportunity {
  id: string;
  title: string;
  type: string;        // employment type
  pay: string;
  city: string;
  specs: string[];
  applicants: number;
  posted: string;
  status: OpportunityStatus;
}

export const OPPORTUNITIES: SampleOpportunity[] = [
  { id: "knotless-wknd", title: "Weekend knotless specialist", type: "Part-time", pay: "$28–35/hr", city: "Atlanta, GA", specs: ["Knotless", "Feed-in"], applicants: 9,  posted: "2h ago", status: "active" },
  { id: "senior-ft",     title: "Full-time senior braider",    type: "Full-time", pay: "$45k–60k",  city: "Atlanta, GA", specs: ["Box braids", "Locs"],  applicants: 14, posted: "1d ago", status: "active" },
  { id: "event-1day",    title: "Event braider (1 day)",       type: "Single event", pay: "$320 flat", city: "Decatur, GA", specs: ["Goddess braids"],   applicants: 4,  posted: "3d ago", status: "active" },
  { id: "apprentice",    title: "Apprentice braider",          type: "Part-time", pay: "$18–24/hr", city: "Smyrna, GA",  specs: ["Cornrows", "Stitch braids"], applicants: 0, posted: "Draft", status: "draft" },
];

export const OPPORTUNITY_TYPES = ["Part-time", "Full-time", "Contract", "Single event"];
export const EXPERIENCE_LEVELS = ["Any", "1+ years", "3+ years", "5+ years"];

export type ApplicantStatus = "New" | "Shortlisted" | "Matched" | "Declined";

export interface SampleApplicant {
  id: string;
  name: string;
  experience: string;
  specs: string[];
  rate: number;
  rev: number;
  status: ApplicantStatus;
  appliedFor: string;
}

export const APPLICANTS: SampleApplicant[] = [
  { id: "imani", name: "Imani Carter", experience: "5 yrs", specs: ["Knotless", "Feed-in"], rate: 4.9, rev: 210, status: "New",         appliedFor: "Weekend knotless specialist" },
  { id: "zola",  name: "Zola Adeyemi", experience: "7 yrs", specs: ["Senegalese twists"],   rate: 4.7, rev: 73,  status: "Shortlisted", appliedFor: "Full-time senior braider" },
  { id: "nia",   name: "Nia Robinson", experience: "4 yrs", specs: ["Goddess braids", "Knotless"], rate: 4.9, rev: 142, status: "Matched", appliedFor: "Event braider (1 day)" },
  { id: "tasha", name: "Tasha Bell",   experience: "6 yrs", specs: ["Box braids"],          rate: 4.8, rev: 96,  status: "New",         appliedFor: "Full-time senior braider" },
  { id: "lina",  name: "Lina Mensah",  experience: "8 yrs", specs: ["Locs", "Faux locs"],   rate: 5.0, rev: 54,  status: "Shortlisted", appliedFor: "Weekend knotless specialist" },
];

/* ── Salons (public discovery) ───────────────────────────────────── */

export interface SampleSalon {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  services: string[];
  openRoles: number;
  verified: boolean;
  tone: number;
}

export const SALONS: SampleSalon[] = [
  { id: "crown-coils",   name: "Crown & Coils",   city: "Atlanta, GA",  rating: 4.9, reviews: 320, services: ["Knotless", "Box braids", "Feed-in"], openRoles: 3, verified: true,  tone: 0 },
  { id: "braid-bar",     name: "The Braid Bar",   city: "Decatur, GA",  rating: 4.8, reviews: 210, services: ["Box braids", "Locs"],               openRoles: 2, verified: true,  tone: 1 },
  { id: "halo-studio",   name: "Halo Studio",     city: "Atlanta, GA",  rating: 4.7, reviews: 148, services: ["Goddess braids", "Senegalese twists"], openRoles: 1, verified: false, tone: 2 },
  { id: "roots-crowns",  name: "Roots & Crowns",  city: "Smyrna, GA",   rating: 4.9, reviews: 96,  services: ["Cornrows", "Stitch braids"],        openRoles: 2, verified: true,  tone: 3 },
  { id: "gilded-braids", name: "Gilded Braids",   city: "Marietta, GA", rating: 4.6, reviews: 74,  services: ["Faux locs", "Knotless"],            openRoles: 0, verified: false, tone: 4 },
  { id: "the-parting",   name: "The Parting Room",city: "Atlanta, GA",  rating: 5.0, reviews: 52,  services: ["Feed-in", "Goddess braids"],        openRoles: 1, verified: true,  tone: 5 },
];

/* ── Braider-side sample data ────────────────────────────────────── */

export interface SampleJob {
  id: string;
  title: string;
  salon: string;
  city: string;
  pay: string;
  distance: string;
  type: string;
  specs: string[];
  posted: string;
}

export const JOBS: SampleJob[] = [
  { id: "knotless-wknd", title: "Weekend knotless specialist", salon: "Crown & Coils", city: "Atlanta, GA", pay: "$28–35/hr", distance: "2.3 mi", type: "Part-time",    specs: ["Knotless", "Feed-in"],     posted: "2h ago" },
  { id: "senior-ft",     title: "Senior braider — full time",  salon: "The Braid Bar", city: "Decatur, GA", pay: "$45k–60k",  distance: "5.1 mi", type: "Full-time",    specs: ["Box braids", "Locs"],      posted: "1d ago" },
  { id: "event-1day",    title: "Event braider (1 day)",       salon: "Halo Studio",   city: "Atlanta, GA", pay: "$320 flat", distance: "3.8 mi", type: "Single event", specs: ["Goddess braids"],          posted: "3d ago" },
  { id: "apprentice",    title: "Apprentice braider",          salon: "Roots & Crowns",city: "Smyrna, GA",  pay: "$18–24/hr", distance: "7.2 mi", type: "Part-time",    specs: ["Cornrows", "Stitch braids"], posted: "4d ago" },
];

export type ApplicationStatus = "Shortlisted" | "Under review" | "Not selected" | "Matched";

export interface SampleApplication {
  id: string;
  role: string;
  salon: string;
  when: string;
  status: ApplicationStatus;
}

export const APPLICATIONS: SampleApplication[] = [
  { id: "a1", role: "Lead stylist",      salon: "Halo Studio",    when: "Applied 2 days ago",  status: "Shortlisted"  },
  { id: "a2", role: "Weekend braider",   salon: "Crown & Coils",  when: "Applied 3 days ago",  status: "Under review" },
  { id: "a3", role: "Full-time braider", salon: "The Braid Bar",  when: "Applied 1 week ago",  status: "Not selected" },
  { id: "a4", role: "Event braider",     salon: "Roots & Crowns", when: "Applied 1 week ago",  status: "Matched"      },
];

/* ── Messaging sample data ───────────────────────────────────────── */

export interface SampleMessage {
  me: boolean;   // true = the salon (current user)
  text: string;
  time: string;
}

export interface SampleConversation {
  id: string;
  name: string;      // the braider
  context: string;   // opportunity / role context shown as a badge
  time: string;      // last-activity label
  unread: boolean;
  online: boolean;
  messages: SampleMessage[];
}

export const CONVERSATIONS: SampleConversation[] = [
  {
    id: "imani",
    name: "Imani Carter",
    context: "Knotless specialist",
    time: "2m",
    unread: true,
    online: true,
    messages: [
      { me: false, text: "Hi! I saw your knotless opportunity — I have 5 years of experience and full weekend availability.", time: "10:24" },
      { me: true,  text: "Your portfolio is beautiful. Could you start next Saturday at 9am?", time: "10:31" },
      { me: false, text: "Yes, I can start next Saturday!", time: "10:33" },
    ],
  },
  {
    id: "zola",
    name: "Zola Adeyemi",
    context: "Senior braider",
    time: "1h",
    unread: false,
    online: false,
    messages: [
      { me: false, text: "Thanks for shortlisting me 🙏", time: "09:02" },
      { me: true,  text: "Of course — your Senegalese work stood out. Are you open to full-time?", time: "09:15" },
    ],
  },
  {
    id: "nia",
    name: "Nia Robinson",
    context: "Event braider",
    time: "3h",
    unread: false,
    online: false,
    messages: [
      { me: true,  text: "You're matched for the Saturday event — details to follow!", time: "Yesterday" },
      { me: false, text: "Sounds great, see you then.", time: "Yesterday" },
    ],
  },
  {
    id: "tasha",
    name: "Tasha Bell",
    context: "Full-time senior braider",
    time: "1d",
    unread: false,
    online: false,
    messages: [
      { me: false, text: "What hair brand do you provide?", time: "Mon" },
    ],
  },
];
