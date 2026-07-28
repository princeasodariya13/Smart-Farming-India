"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { Leaf } from "lucide-react";
import PageLoader from '@/components/PageLoader';
import NotificationBell from '@/components/NotificationBell';

import { CommunityHero } from "@/components/community/CommunityHero";
import { StatsOverview } from "@/components/community/StatsOverview";
import { CreatePost } from "@/components/community/CreatePost";
import { FeedTabs } from "@/components/community/FeedTabs";
import { FeedCard } from "@/components/community/FeedCard";
import { ExpertAnswerCard } from "@/components/community/ExpertAnswerCard";
import { TrendingSidebar } from "@/components/community/TrendingSidebar";
import { CategoryGrid } from "@/components/community/CategoryCard";
import { PopularFarmersPanel } from "@/components/community/PopularFarmerCard";
import { NearbyFarmers } from "@/components/community/NearbyFarmers";
import { CommunityEventsSection } from "@/components/community/CommunityEventCard";
import { LeaderboardPanel } from "@/components/community/LeaderboardCard";
import { NotificationsPanel } from "@/components/community/NotificationCard";
import { EmptyState } from "@/components/community/EmptyState";
import { FeedSkeletonList } from "@/components/community/SkeletonLoader";

import {
  communityStats,
  cropCategories,
  communityPosts,
  trendingTopics,
  popularFarmers,
  nearbyFarmers,
  communityEvents,
  leaderboard,
  communityNotifications,
  trendingSearchSuggestions,
} from "@/data/community-mock";
import type { FeedTabKey } from "@/types/community";

function CommunityContent() {
  const { data: session, status } = useSession();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FeedTabKey>("for-you");
  const [isLoading, setIsLoading] = useState(true);
  const [realPosts, setRealPosts] = useState<any[]>([]);

  // Fetch real data
  useEffect(() => {
    fetch('/api/community')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts) {
          setRealPosts(data.posts);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleCreatePost = async (payload: { text: string; crop: string | null; mode: string }) => {
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: payload.text,
          type: payload.mode,
          tags: payload.crop ? [payload.crop] : []
        })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setRealPosts(prev => [data.post, ...prev]);
      }
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  const allPosts = useMemo(() => {
    const formattedReal = realPosts.map(p => ({
      id: p.id,
      author: {
        name: p.user?.name || "Farmer",
        role: "Community Member",
        avatar: p.user?.image || "https://i.pravatar.cc/100?img=12",
        verified: false,
      },
      content: p.content,
      images: p.images || [],
      likes: p.likes || 0,
      comments: p.comments?.length || 0,
      shares: 0,
      timeAgo: "Just now",
      tags: p.tags || [],
      type: p.type || "post",
    }));
    return [...formattedReal, ...communityPosts];
  }, [realPosts]);

  const visiblePosts = useMemo(() => {
    switch (activeTab) {
      case "questions":
        return allPosts.filter((p) => p.type === "question");
      case "photos":
        return allPosts.filter((p) => p.type === "photo" || (p.images && p.images.length > 0));
      case "videos":
        return allPosts.filter((p) => p.type === "video");
      default:
        return allPosts;
    }
  }, [activeTab, allPosts]);

  const categoryByKey = useMemo(
    () => Object.fromEntries(cropCategories.map((c) => [c.key, c])),
    []
  );

  if (status === "loading") {
    return <PageLoader />;
  }

  const farmerName = session?.user?.name?.split(" ")[0] ?? "Farmer";
  const avatarUrl = session?.user?.image ?? "https://i.pravatar.cc/100?img=12";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "F";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

  return (
    <div className="flex h-screen overflow-hidden text-on-surface bg-background-sage font-sans">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full w-64 md:w-48 bg-surface-container-low border-r border-outline-variant p-2.5 gap-2 shadow-2xl md:shadow-none`}
      >
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary text-on-primary">
              <Leaf size={16} strokeWidth={2.5} />
            </div>
            <h1 className="text-[13px] font-extrabold tracking-tight text-on-surface">
              Smart Farming<span className="text-primary">.</span>
            </h1>
          </div>
          <button
            className="md:hidden text-on-surface hover:bg-surface-container-high p-1 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav data-lenis-prevent="true" className="flex-1 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-[12px] font-medium">Dashboard</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/gps-area-calculator">
            <span className="material-symbols-outlined text-[18px]">map</span>
            <span className="text-[12px] font-medium">GPS Area Calculator</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/weather">
            <span className="material-symbols-outlined text-[18px]">early_on</span>
            <span className="text-[12px] font-medium">Weather</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/disease-detection">
            <span className="material-symbols-outlined text-[18px]">shutter_speed</span>
            <span className="text-[12px] font-medium">Scanner</span>
          </Link>


          {/* Community — active */}

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/market">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span className="text-[12px] font-medium">Marketplace</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/schemes">
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span className="text-[12px] font-medium">Schemes</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/community">
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span className="text-[12px] font-medium">Community</span>
          </Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/analytics">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span className="text-[12px] font-medium">Analytics</span>
          </Link>

          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/settings">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-[12px] font-medium">Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-3 border-t border-outline-variant space-y-1">
          <Link href="/consult" className="w-full block text-center mb-3 py-2.5 bg-primary text-on-primary rounded-lg text-[12px] font-bold shadow-sm active:scale-95 transition-all">Consult Expert</Link>
          <Link className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" href="/support">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="text-[12px] font-medium">Support</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="text-[12px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TopNavBar */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-white/20 h-12 sticky top-0 z-40 flex items-center justify-between px-6 w-full shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex md:hidden items-center gap-2 mr-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="p-1 rounded-lg bg-primary text-on-primary">
                <Leaf size={14} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-extrabold tracking-tight text-on-surface">
                Smart Farming<span className="text-primary">.</span>
              </span>
            </div>
                      </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="h-6 w-px bg-outline-variant mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-bold text-on-surface leading-none">{session?.user?.name ?? "Farmer"}</p>
              </div>
              <Link href="/profile" className="block relative cursor-pointer hover:opacity-80 transition-opacity">
                {session?.user?.image ? (
                  <Image
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                    alt="User profile"
                    src={session.user.image}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center text-[12px] font-bold tracking-wider">
                    {getInitials(session?.user?.name)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto custom-scrollbar bg-background-sage"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 pb-24"
          >
            <CommunityHero
              farmerFirstName={farmerName}
              categories={cropCategories}
              trendingQueries={trendingSearchSuggestions}
            />

            <StatsOverview stats={communityStats} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Main feed column */}
              <div className="flex flex-col gap-6 lg:col-span-8">
                <CreatePost
                authorName={farmerName}
                authorAvatarUrl={avatarUrl}
                categories={cropCategories}
                onSubmit={handleCreatePost}
              />

                <FeedTabs active={activeTab} onChange={setActiveTab} />

                <div id="community-feed-panel" role="tabpanel" aria-labelledby={`feed-tab-${activeTab}`}>
                  {isLoading ? (
                    <FeedSkeletonList count={3} />
                  ) : visiblePosts.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-6"
                      >
                        {visiblePosts.map((post, i) => (
                          <div key={post.id} className="flex flex-col gap-0 overflow-hidden rounded-xl">
                            <FeedCard post={post} category={post.crop ? categoryByKey[post.crop] : undefined} index={i} />
                            {post.expertAnswer && (
                              <div className="-mt-px rounded-b-xl border border-t-0 border-outline-variant/30 p-5 sm:p-6">
                                <ExpertAnswerCard answer={post.expertAnswer} />
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                <CategoryGrid categories={cropCategories} />
                <CommunityEventsSection events={communityEvents} />
              </div>

              {/* Sidebar column */}
              <aside className="flex flex-col gap-6 lg:col-span-4">
                <NotificationsPanel notifications={communityNotifications} />
                <TrendingSidebar topics={trendingTopics} />
                <PopularFarmersPanel farmers={popularFarmers} />
                <NearbyFarmers farmers={nearbyFarmers} />
                <LeaderboardPanel entries={leaderboard} />
              </aside>
            </div>
          </motion.div>

          {/* Footer */}
          <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center bg-surface-container-lowest border-t border-outline-variant">
            <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
              <h4 className="text-base font-bold text-primary">Smart Farming India</h4>
              <p className="text-xs text-on-surface-variant mt-1 text-center md:text-left max-w-sm">
                © 2026 Smart Farming India. Empowering the roots of our nation.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8 whitespace-nowrap overflow-x-auto pb-2 md:pb-0 max-w-full">
              <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
              <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
              <Link className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="/about">About Us</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <SessionProvider>
      <CommunityContent />
    </SessionProvider>
  );
}













