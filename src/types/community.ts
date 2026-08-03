// ─────────────────────────────────────────────────────────────────────────
// Smart Farming India — Community Page
// Shared TypeScript contracts.
// Wire real API/DB responses to these interfaces later.
// ─────────────────────────────────────────────────────────────────────────

export type CropKey =
  | "wheat"
  | "rice"
  | "cotton"
  | "sugarcane"
  | "maize"
  | "fruits"
  | "vegetables"
  | "pulses"
  | "flowers"
  | "organic"
  | "groundnut"
  | "castor"
  | "bajra"
  | "mango"
  | "tobacco";

export interface CropCategory {
  key: CropKey;
  label: string;
  postCount: number;
  /** Tailwind color token pair used for the category's "seed packet" spine + icon chip */
  accent: {
    bg: string; // e.g. "bg-amber-100"
    text: string; // e.g. "text-amber-700"
    spine: string; // e.g. "bg-amber-500"
  };
}

export interface FarmerAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  location: string;
  verified?: boolean;
  isExpert?: boolean;
  expertQualification?: string;
  followers?: number;
  isFollowing?: boolean;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  closesInHours?: number;
}

export interface ExpertAnswer {
  id: string;
  expert: FarmerAuthor;
  answer: string;
  helpfulVotes: number;
  postedAt: string;
}

export interface CommunityPost {
  id: string;
  author: FarmerAuthor;
  postedAt: string;
  crop?: CropKey;
  type: "text" | "question" | "photo" | "video" | "poll" | "voice";
  title?: string;
  description: string;
  images?: string[];
  videoThumbnailUrl?: string;
  poll?: Poll;
  likes: number;
  likedByIds?: string[];
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isSolved?: boolean;
  expertAnswer?: ExpertAnswer;
  tags?: string[];
}

export interface CommunityStat {
  id: string;
  label: string;
  value: string;
  deltaLabel?: string;
  icon: string; // lucide icon name, resolved by the component
}

export interface TrendingTopic {
  id: string;
  rank: number;
  title: string;
  meta: string;
  category: "crop" | "pest" | "weather" | "scheme" | "market";
}

export interface PopularFarmer {
  id: string;
  name: string;
  avatarUrl: string;
  badge: string;
  followers: number;
  posts: number;
  isFollowing?: boolean;
}

export interface NearbyFarmer {
  id: string;
  name: string;
  avatarUrl: string;
  distanceKm: number;
  crop: string;
  online?: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: "Workshop" | "Seminar" | "Exhibition" | "Meeting" | "Webinar";
  date: string;
  time: string;
  location: string;
  isOnline?: boolean;
  attendees: number;
  bannerUrl?: string;
}

export interface CommunityNotification {
  id: string;
  type: "comment" | "follower" | "reply" | "mention" | "expert";
  actor: string;
  actorAvatarUrl: string;
  message: string;
  postedAt: string;
  read?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  score: number;
  helpfulAnswers: number;
  badge?: string;
}

export type FeedTabKey =
  | "for-you"
  | "trending"
  | "following"
  | "nearby"
  | "questions"
  | "photos"
  | "videos"
  | "latest"
  | "saved";
