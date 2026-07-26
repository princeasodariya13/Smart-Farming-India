import type {
  CommunityEvent,
  CommunityNotification,
  CommunityPost,
  CommunityStat,
  CropCategory,
  LeaderboardEntry,
  NearbyFarmer,
  PopularFarmer,
  TrendingTopic,
} from "@/types/community";

// Replace every export in this file with live data from your API layer.
// Shapes match `types/community.ts` exactly so swapping is a 1:1 job.

export const communityStats: CommunityStat[] = [
  { id: "farmers", label: "Total Farmers", value: "48,230", deltaLabel: "+320 this week", icon: "Users" },
  { id: "active", label: "Active Today", value: "6,412", deltaLabel: "13% of network", icon: "Activity" },
  { id: "asked", label: "Questions Asked", value: "12,904", deltaLabel: "+184 today", icon: "HelpCircle" },
  { id: "solved", label: "Questions Solved", value: "10,588", deltaLabel: "82% solve rate", icon: "CheckCircle2" },
  { id: "photos", label: "Crop Photos Shared", value: "31,760", deltaLabel: "+540 today", icon: "Image" },
  { id: "experts", label: "Experts Online", value: "42", deltaLabel: "Live now", icon: "BadgeCheck" },
  { id: "nearby", label: "Nearby Farmers", value: "186", deltaLabel: "within 25 km", icon: "MapPin" },
  { id: "discussions", label: "Total Discussions", value: "9,145", deltaLabel: "+96 today", icon: "MessagesSquare" },
];

export const cropCategories: CropCategory[] = [
  { key: "wheat", label: "Wheat", postCount: 1284, accent: { bg: "bg-amber-100", text: "text-amber-800", spine: "bg-amber-500" } },
  { key: "rice", label: "Rice", postCount: 2110, accent: { bg: "bg-emerald-100", text: "text-emerald-800", spine: "bg-emerald-500" } },
  { key: "cotton", label: "Cotton", postCount: 946, accent: { bg: "bg-sky-100", text: "text-sky-800", spine: "bg-sky-500" } },
  { key: "sugarcane", label: "Sugarcane", postCount: 780, accent: { bg: "bg-lime-100", text: "text-lime-800", spine: "bg-lime-500" } },
  { key: "maize", label: "Maize", postCount: 654, accent: { bg: "bg-yellow-100", text: "text-yellow-800", spine: "bg-yellow-500" } },
  { key: "fruits", label: "Fruits", postCount: 1032, accent: { bg: "bg-rose-100", text: "text-rose-800", spine: "bg-rose-500" } },
  { key: "vegetables", label: "Vegetables", postCount: 1567, accent: { bg: "bg-orange-100", text: "text-orange-800", spine: "bg-orange-500" } },
  { key: "pulses", label: "Pulses", postCount: 512, accent: { bg: "bg-teal-100", text: "text-teal-800", spine: "bg-teal-500" } },
  { key: "flowers", label: "Flowers", postCount: 298, accent: { bg: "bg-fuchsia-100", text: "text-fuchsia-800", spine: "bg-fuchsia-500" } },
  { key: "organic", label: "Organic Farming", postCount: 873, accent: { bg: "bg-green-100", text: "text-green-800", spine: "bg-green-600" } },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post-1",
    author: {
      id: "u-1",
      name: "Ramesh Kumar",
      avatarUrl: "https://i.pravatar.cc/100?img=12",
      location: "Nashik, Maharashtra",
      verified: true,
    },
    postedAt: "2h ago",
    crop: "vegetables",
    type: "question",
    title: "Yellowing of tomato leaves — is this early blight?",
    description:
      "Spots appeared on the lower leaves after last week's heavy rain and seem to be spreading upward. Looking for an organic treatment before it reaches the fruiting stage.",
    images: [
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=900&q=80",
    ],
    likes: 128,
    comments: 34,
    shares: 6,
    isSolved: true,
    expertAnswer: {
      id: "ans-1",
      expert: {
        id: "e-1",
        name: "Dr. Anjali Deshmukh",
        avatarUrl: "https://i.pravatar.cc/100?img=47",
        location: "IARI",
        isExpert: true,
        expertQualification: "Senior Agronomist, IARI",
      },
      answer:
        "This is consistent with early blight — the excess moisture triggered fungal growth. Improve airflow, avoid overhead watering, and apply a neem-oil based spray this week.",
      helpfulVotes: 61,
      postedAt: "1h ago",
    },
  },
  {
    id: "post-2",
    author: {
      id: "u-2",
      name: "Priya Patel",
      avatarUrl: "https://i.pravatar.cc/100?img=32",
      location: "Anand, Gujarat",
    },
    postedAt: "4h ago",
    crop: "organic",
    type: "photo",
    title: "First harvest from the new vermicompost beds 🌱",
    description:
      "Switched half the plot to vermicompost three months ago — soil texture and yield both look noticeably better than the chemical-fed half.",
    images: [
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=900&q=80",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=80",
    ],
    likes: 342,
    comments: 58,
    shares: 21,
  },
  {
    id: "post-3",
    author: {
      id: "u-3",
      name: "Sameer Shaikh",
      avatarUrl: "https://i.pravatar.cc/100?img=15",
      location: "Anand, Gujarat",
    },
    postedAt: "5h ago",
    crop: "wheat",
    type: "voice",
    description: "Asking about subsidized solar pump availability in Anand district this season.",
    likes: 19,
    comments: 5,
    shares: 1,
  },
  {
    id: "post-4",
    author: {
      id: "u-4",
      name: "Lakshmi Narayanan",
      avatarUrl: "https://i.pravatar.cc/100?img=45",
      location: "Thanjavur, Tamil Nadu",
      verified: true,
    },
    postedAt: "7h ago",
    crop: "rice",
    type: "poll",
    title: "Which nursery method are you using this Kharif season?",
    description: "Comparing adoption across the group before I switch my own 4-acre plot.",
    poll: {
      question: "Which nursery method are you using this Kharif season?",
      options: [
        { id: "o1", label: "Traditional wet-bed", votes: 412 },
        { id: "o2", label: "SRI (System of Rice Intensification)", votes: 268 },
        { id: "o3", label: "Direct seeded rice (DSR)", votes: 190 },
        { id: "o4", label: "Mat-type mechanical nursery", votes: 74 },
      ],
      totalVotes: 944,
      closesInHours: 18,
    },
    likes: 87,
    comments: 41,
    shares: 9,
  },
  {
    id: "post-5",
    author: {
      id: "u-5",
      name: "Devendra Singh",
      avatarUrl: "https://i.pravatar.cc/100?img=68",
      location: "Ludhiana, Punjab",
    },
    postedAt: "9h ago",
    crop: "cotton",
    type: "video",
    title: "Drip irrigation retrofit — 6 month results",
    description:
      "Walking through what changed after retrofitting flood-irrigated cotton rows to drip: water use, labor, and early yield signs.",
    videoThumbnailUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80",
    likes: 205,
    comments: 27,
    shares: 33,
  },
];

export const trendingTopics: TrendingTopic[] = [
  { id: "t1", rank: 1, title: "PM-Kisan Scheme 16th Installment", meta: "1.2k farmers discussing", category: "scheme" },
  { id: "t2", rank: 2, title: "Hydroponic Fodder Success Stories", meta: "850 posts today", category: "crop" },
  { id: "t3", rank: 3, title: "New Bt-Cotton Seed Pricing", meta: "430 farmers discussing", category: "market" },
  { id: "t4", rank: 4, title: "Armyworm Outbreak — Maize Belt", meta: "Reports rising in 3 states", category: "pest" },
  { id: "t5", rank: 5, title: "Pre-monsoon Weather Advisory", meta: "IMD update, 6 states", category: "weather" },
];

export const popularFarmers: PopularFarmer[] = [
  { id: "pf1", name: "Dr. Kavita Rao", avatarUrl: "https://i.pravatar.cc/100?img=44", badge: "Soil Specialist", followers: 18400, posts: 342 },
  { id: "pf2", name: "Vikram Singh", avatarUrl: "https://i.pravatar.cc/100?img=51", badge: "Plant Pathology", followers: 12100, posts: 210 },
  { id: "pf3", name: "Meera Joshi", avatarUrl: "https://i.pravatar.cc/100?img=25", badge: "Top Contributor", followers: 9800, posts: 415 },
];

export const nearbyFarmers: NearbyFarmer[] = [
  { id: "nf1", name: "Suresh Patil", avatarUrl: "https://i.pravatar.cc/100?img=8", distanceKm: 2.1, crop: "Grapes", online: true },
  { id: "nf2", name: "Anita Deshpande", avatarUrl: "https://i.pravatar.cc/100?img=29", distanceKm: 4.6, crop: "Onion", online: true },
  { id: "nf3", name: "Ganesh More", avatarUrl: "https://i.pravatar.cc/100?img=60", distanceKm: 7.8, crop: "Sugarcane", online: false },
  { id: "nf4", name: "Rekha Salunkhe", avatarUrl: "https://i.pravatar.cc/100?img=36", distanceKm: 9.3, crop: "Tomato", online: false },
];

export const communityEvents: CommunityEvent[] = [
  {
    id: "ev1",
    title: "Organic Certification Workshop",
    type: "Workshop",
    date: "Aug 3, 2026",
    time: "10:00 AM",
    location: "Krishi Vigyan Kendra, Nashik",
    attendees: 128,
    bannerUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80",
  },
  {
    id: "ev2",
    title: "Precision Irrigation Webinar",
    type: "Webinar",
    date: "Aug 6, 2026",
    time: "6:30 PM",
    location: "Online",
    isOnline: true,
    attendees: 640,
    bannerUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
  },
  {
    id: "ev3",
    title: "Rabi Season Farmer Meeting",
    type: "Meeting",
    date: "Aug 12, 2026",
    time: "9:00 AM",
    location: "Panchayat Ground, Anand",
    attendees: 96,
    bannerUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
];

export const communityNotifications: CommunityNotification[] = [
  { id: "n1", type: "expert", actor: "Dr. Anjali Deshmukh", actorAvatarUrl: "https://i.pravatar.cc/100?img=47", message: "answered your question on tomato blight", postedAt: "12m ago", read: false },
  { id: "n2", type: "comment", actor: "Priya Patel", actorAvatarUrl: "https://i.pravatar.cc/100?img=32", message: "commented on your vermicompost post", postedAt: "48m ago", read: false },
  { id: "n3", type: "follower", actor: "Ganesh More", actorAvatarUrl: "https://i.pravatar.cc/100?img=60", message: "started following you", postedAt: "3h ago", read: true },
  { id: "n4", type: "mention", actor: "Vikram Singh", actorAvatarUrl: "https://i.pravatar.cc/100?img=51", message: "mentioned you in a reply", postedAt: "1d ago", read: true },
];

export const leaderboard: LeaderboardEntry[] = [
  { id: "l1", rank: 1, name: "Dr. Kavita Rao", avatarUrl: "https://i.pravatar.cc/100?img=44", score: 9840, helpfulAnswers: 412, badge: "Top Expert" },
  { id: "l2", rank: 2, name: "Meera Joshi", avatarUrl: "https://i.pravatar.cc/100?img=25", score: 8120, helpfulAnswers: 355 },
  { id: "l3", rank: 3, name: "Vikram Singh", avatarUrl: "https://i.pravatar.cc/100?img=51", score: 7460, helpfulAnswers: 298, badge: "Top Expert" },
  { id: "l4", rank: 4, name: "Ramesh Kumar", avatarUrl: "https://i.pravatar.cc/100?img=12", score: 5210, helpfulAnswers: 140 },
  { id: "l5", rank: 5, name: "Lakshmi Narayanan", avatarUrl: "https://i.pravatar.cc/100?img=45", score: 4890, helpfulAnswers: 122 },
];

export const trendingSearchSuggestions = [
  "early blight tomato",
  "PM-Kisan installment",
  "drip irrigation cost",
  "organic pesticide neem",
  "wheat MSP 2026",
];
