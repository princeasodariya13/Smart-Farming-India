import type {
  CommunityEvent,
  CommunityNotification,
  CommunityPost,
  CommunityStat,
  CropCategory,
  LeaderboardEntry,
  PopularFarmer,
  TrendingTopic,
} from "@/types/community";

// Gujarat-specific community data

export const communityStats: CommunityStat[] = [
  { id: "farmers", label: "Gujarat Farmers", value: "52,840", deltaLabel: "+410 this week", icon: "Users" },
  { id: "active", label: "Active Today", value: "7,218", deltaLabel: "14% of network", icon: "Activity" },
  { id: "asked", label: "Questions Asked", value: "14,320", deltaLabel: "+210 today", icon: "HelpCircle" },
  { id: "solved", label: "Questions Solved", value: "11,980", deltaLabel: "84% solve rate", icon: "CheckCircle2" },
  { id: "photos", label: "Crop Photos Shared", value: "38,450", deltaLabel: "+620 today", icon: "Image" },
  { id: "experts", label: "Experts Online", value: "38", deltaLabel: "Live now", icon: "BadgeCheck" },
  { id: "nearby", label: "Nearby Farmers", value: "214", deltaLabel: "within 25 km", icon: "MapPin" },
  { id: "discussions", label: "Total Discussions", value: "10,640", deltaLabel: "+112 today", icon: "MessagesSquare" },
];

export const cropCategories: CropCategory[] = [
  { key: "groundnut", label: "Groundnut", postCount: 2410, accent: { bg: "bg-amber-100", text: "text-amber-800", spine: "bg-amber-500" } },
  { key: "cotton", label: "Cotton (Bt)", postCount: 1980, accent: { bg: "bg-sky-100", text: "text-sky-800", spine: "bg-sky-500" } },
  { key: "castor", label: "Castor", postCount: 840, accent: { bg: "bg-red-100", text: "text-red-800", spine: "bg-red-500" } },
  { key: "wheat", label: "Wheat", postCount: 1120, accent: { bg: "bg-yellow-100", text: "text-yellow-800", spine: "bg-yellow-500" } },
  { key: "bajra", label: "Bajra (Millet)", postCount: 760, accent: { bg: "bg-orange-100", text: "text-orange-800", spine: "bg-orange-500" } },
  { key: "vegetables", label: "Vegetables", postCount: 1890, accent: { bg: "bg-green-100", text: "text-green-800", spine: "bg-green-600" } },
  { key: "mango", label: "Kesar Mango", postCount: 1340, accent: { bg: "bg-yellow-100", text: "text-yellow-900", spine: "bg-yellow-600" } },
  { key: "tobacco", label: "Tobacco", postCount: 460, accent: { bg: "bg-stone-100", text: "text-stone-800", spine: "bg-stone-500" } },
  { key: "sugarcane", label: "Sugarcane", postCount: 680, accent: { bg: "bg-lime-100", text: "text-lime-800", spine: "bg-lime-500" } },
  { key: "organic", label: "Organic Farming", postCount: 920, accent: { bg: "bg-teal-100", text: "text-teal-800", spine: "bg-teal-600" } },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post-1",
    author: {
      id: "u-1",
      name: "Rameshbhai Patel",
      avatarUrl: "/images/farmers/man1.png",
      location: "Anand, Gujarat",
      verified: true,
    },
    postedAt: "2h ago",
    crop: "groundnut",
    type: "question",
    title: "Groundnut leaf spots after heavy monsoon — tikka disease?",
    description:
      "Spots appeared on lower leaves after last week's heavy rain in Anand district. Spreading upward rapidly. Looking for organic treatment before it reaches pod formation stage. Anyone in Kheda or Anand area facing same issue this season?",
    images: [
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=900&q=80",
    ],
    likes: 148,
    comments: 42,
    shares: 8,
    isSolved: true,
    expertAnswer: {
      id: "ans-1",
      expert: {
        id: "e-1",
        name: "Dr. Kavita Mehta",
        avatarUrl: "/images/farmers/woman1.png",
        location: "AAU, Anand",
        isExpert: true,
        expertQualification: "Senior Agronomist, Anand Agricultural University",
      },
      answer:
        "This is Tikka disease (Early Leaf Spot) caused by Cercospora arachidicola — very common in Gujarat's Kharif season after monsoon. Spray Chlorothalonil 75% WP at 2g/litre. Apply neem oil as preventive after pods begin forming. Ensure proper row spacing for airflow.",
      helpfulVotes: 74,
      postedAt: "1h ago",
    },
  },
  {
    id: "post-2",
    author: {
      id: "u-2",
      name: "Priyaben Desai",
      avatarUrl: "/images/farmers/woman2.png",
      location: "Rajkot, Gujarat",
    },
    postedAt: "4h ago",
    crop: "organic",
    type: "photo",
    title: "First Kesar mango harvest from organic plot in Gir Somnath! 🥭",
    description:
      "Converted 2 bigha to full organic three seasons ago near Junagadh. The GI-tagged Kesar mangoes this year are incredible — better aroma and Brix score than neighboring conventional plots. Happy to share my organic management schedule.",
    images: [
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=900&q=80",
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=900&q=80",
    ],
    likes: 412,
    comments: 68,
    shares: 34,
  },
  {
    id: "post-3",
    author: {
      id: "u-3",
      name: "Jayantibhai Chaudhari",
      avatarUrl: "/images/farmers/man2.png",
      location: "Banaskantha, Gujarat",
    },
    postedAt: "5h ago",
    crop: "cotton",
    type: "voice",
    description: "Asking about subsidized drip irrigation availability for Bt-Cotton in Banaskantha district this Kharif season. Heard there is a new GGRC scheme — can anyone confirm?",
    likes: 24,
    comments: 9,
    shares: 2,
  },
  {
    id: "post-4",
    author: {
      id: "u-4",
      name: "Manubhai Gamit",
      avatarUrl: "/images/farmers/man1.png",
      location: "Bharuch, Gujarat",
      verified: true,
    },
    postedAt: "7h ago",
    crop: "bajra",
    type: "poll",
    title: "Which Bajra variety are you sowing this Kharif 2026?",
    description: "Comparing popular hybrid and open-pollinated Bajra varieties across South Gujarat before finalizing my 5-bigha plot.",
    poll: {
      question: "Which Bajra (Millet) variety are you planting this season?",
      options: [
        { id: "o1", label: "GHB-538 (Gujarat Hybrid)", votes: 512 },
        { id: "o2", label: "Kaveri Super Boss", votes: 318 },
        { id: "o3", label: "GK-1004", votes: 204 },
        { id: "o4", label: "Local open-pollinated", votes: 88 },
      ],
      totalVotes: 1122,
      closesInHours: 20,
    },
    likes: 96,
    comments: 47,
    shares: 11,
  },
  {
    id: "post-5",
    author: {
      id: "u-5",
      name: "Kamlesh Vasava",
      avatarUrl: "/images/farmers/man2.png",
      location: "Narmada, Gujarat",
    },
    postedAt: "9h ago",
    crop: "castor",
    type: "video",
    title: "Castor harvesting mechanization — 6 month results from Narmada",
    description:
      "Sharing results after retrofitting manual castor harvesting with a mechanized process near the Narmada riverbank plots. Water use reduced by 28%, labor costs cut by half.",
    videoThumbnailUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80",
    likes: 218,
    comments: 31,
    shares: 28,
  },
];

export const trendingTopics: TrendingTopic[] = [
  { id: "t1", rank: 1, title: "PM-KUSUM Solar Pump Scheme – Gujarat 2026", meta: "1.8k farmers discussing", category: "scheme" },
  { id: "t2", rank: 2, title: "Kesar Mango GI Export Prices", meta: "1.2k posts this week", category: "market" },
  { id: "t3", rank: 3, title: "Bt-Cotton Pink Bollworm Alert – Saurashtra", meta: "640 farmers reporting", category: "pest" },
  { id: "t4", rank: 4, title: "GGRC Drip Irrigation 50% Subsidy", meta: "New scheme, apply before Aug 31", category: "scheme" },
  { id: "t5", rank: 5, title: "Pre-Monsoon IMD Advisory – Gujarat Coast", meta: "Cyclone watch, Saurashtra coast", category: "weather" },
];

export const popularFarmers: PopularFarmer[] = [
  { id: "pf1", name: "Dr. Kavita Mehta", avatarUrl: "/images/farmers/woman1.png", badge: "Soil Specialist, AAU", followers: 19800, posts: 362 },
  { id: "pf2", name: "Vikrambhai Rajput", avatarUrl: "/images/farmers/man1.png", badge: "Plant Pathology Expert", followers: 13200, posts: 224 },
  { id: "pf3", name: "Meeraben Prajapati", avatarUrl: "/images/farmers/woman2.png", badge: "Top Contributor", followers: 10400, posts: 438 },
];


export const communityEvents: CommunityEvent[] = [
  {
    id: "ev1",
    title: "Groundnut Pest Management Workshop",
    type: "Workshop",
    date: "Aug 8, 2026",
    time: "10:00 AM",
    location: "KVK Anand, Anand Agricultural University",
    attendees: 164,
    bannerUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80",
  },
  {
    id: "ev2",
    title: "Drip Irrigation for Cotton — GGRC Webinar",
    type: "Webinar",
    date: "Aug 11, 2026",
    time: "6:00 PM",
    location: "Online (Zoom)",
    isOnline: true,
    attendees: 820,
    bannerUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
  },
  {
    id: "ev3",
    title: "Kharif Season Farmer Mela — Rajkot",
    type: "Meeting",
    date: "Aug 16, 2026",
    time: "9:00 AM",
    location: "Rajkot Krishi Utsav Ground, Rajkot",
    attendees: 1240,
    bannerUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
];

export const communityNotifications: CommunityNotification[] = [
  { id: "n1", type: "expert", actor: "Dr. Kavita Mehta", actorAvatarUrl: "/images/farmers/woman1.png", message: "answered your question on groundnut leaf spot", postedAt: "15m ago", read: false },
  { id: "n2", type: "comment", actor: "Priyaben Desai", actorAvatarUrl: "/images/farmers/woman2.png", message: "commented on your Kesar mango post", postedAt: "52m ago", read: false },
  { id: "n3", type: "follower", actor: "Ganeshbhai Gamit", actorAvatarUrl: "/images/farmers/man1.png", message: "started following you from Narmada", postedAt: "3h ago", read: true },
  { id: "n4", type: "mention", actor: "Vikrambhai Rajput", actorAvatarUrl: "/images/farmers/man2.png", message: "mentioned you in a cotton pest alert post", postedAt: "1d ago", read: true },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: "l1", rank: 1, name: "Dr. Kavita Mehta", avatarUrl: "/images/farmers/woman1.png", score: 10240, helpfulAnswers: 434, badge: "Top Expert" },
  { id: "l2", rank: 2, name: "Meeraben Prajapati", avatarUrl: "/images/farmers/woman2.png", score: 8640, helpfulAnswers: 372 },
  { id: "l3", rank: 3, name: "Vikrambhai Rajput", avatarUrl: "/images/farmers/man1.png", score: 7820, helpfulAnswers: 316, badge: "Top Expert" },
  { id: "l4", rank: 4, name: "Rameshbhai Patel", avatarUrl: "/images/farmers/man2.png", score: 5640, helpfulAnswers: 158 },
  { id: "l5", rank: 5, name: "Manubhai Gamit", avatarUrl: "/images/farmers/man1.png", score: 5120, helpfulAnswers: 136 },
];

export const trendingSearchSuggestions = [
  "tikka disease groundnut Gujarat",
  "PM-KUSUM solar pump Gujarat apply",
  "Kesar mango GI export price 2026",
  "Bt cotton pink bollworm Saurashtra",
  "GGRC drip irrigation subsidy",
];
