"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import { Leaf, Loader2 } from "lucide-react";
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
  const [realStats, setRealStats] = useState<any[]>(communityStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load saved posts from local storage initially and on custom event
  useEffect(() => {
    const loadSaved = () => {
      if (typeof window !== "undefined") {
        const saved = JSON.parse(localStorage.getItem("sf_bookmarks") || "[]");
        setSavedPostIds(new Set(saved));
      }
    };
    loadSaved();
    window.addEventListener("saved_posts_changed", loadSaved);
    return () => window.removeEventListener("saved_posts_changed", loadSaved);
  }, []);

  // Fetch real data
  useEffect(() => {
    fetch('/api/community')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.posts) {
          setRealPosts(data.posts);
          if (data.stats) {
            setRealStats(data.stats);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleCreatePost = async (payload: { 
    text: string; 
    crop: string | null; 
    mode: string; 
    images?: string[];
    location?: string | null;
    pollOptions?: string[];
  }) => {
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: payload.text,
          type: payload.mode,
          tags: payload.crop ? [payload.crop] : [],
          images: payload.images || [],
          location: payload.location,
          pollOptions: payload.pollOptions
        })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setRealPosts(prev => [data.post, ...prev]);
        // Reset filters so the newly created post is instantly visible at the top
        setSearchQuery("");
        setFilterCategory(null);
        setActiveTab("for-you");
        alert("Post created successfully!");
      } else {
        console.error("API returned error:", data.error);
        alert(`Failed to create post: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Failed to post:", err);
      alert("Network error: Failed to connect to server.");
    }
  };

  const confirmDelete = async (postId: string) => {
    setIsDeleting(true);
    try {
      if (!postId.startsWith("post-")) {
        const res = await fetch(`/api/community?postId=${postId}`, { method: "DELETE" });
        const data = await res.json();
        if (!data.success) {
          alert(`Failed to delete: ${data.error}`);
          setIsDeleting(false);
          return;
        }
      }
      setRealPosts((prev) => prev.filter(p => p.id !== postId));
      setPostToDelete(null);
    } catch (err) {
      alert("Network error: Failed to delete post.");
    }
    setIsDeleting(false);
  };

  const handleSearch = (query: string, category: string | null) => {
    setSearchQuery(query);
    setFilterCategory(category);
  };

  const handleCreatePostClick = () => {
    const composer = document.getElementById("post-composer");
    if (composer) {
      composer.scrollIntoView({ behavior: "smooth", block: "center" });
      const textarea = composer.querySelector("textarea");
      if (textarea) setTimeout(() => textarea.focus(), 500);
    }
  };

  const allPosts = useMemo(() => {
    const formattedReal = realPosts.map(p => ({
      id: p.id,
      author: {
        id: p.userId || "user1",
        name: p.user?.name || "Farmer",
        role: "Community Member",
        avatarUrl: p.user?.image || "https://i.pravatar.cc/100?img=12",
        verified: false,
        location: p.location || "Local Farm"
      },
      content: p.content,
      images: p.images || [],
      likes: p.likes || 0,
      comments: p.comments?.length || 0,
      shares: 0,
      timeAgo: "Just now",
      tags: p.tags || [],
      type: p.type || "post",
      postedAt: p.createdAt || new Date().toISOString(),
      description: p.content,
      crop: p.tags?.[0] || undefined,
      title: p.title || undefined,
      poll: p.pollOptions && p.pollOptions.length > 0 ? {
        question: p.content || "Poll",
        options: p.pollOptions.map((opt: string, i: number) => ({ id: `opt-${i}`, label: opt, votes: 0 })),
        totalVotes: 0,
        closesInHours: 24
      } : undefined,
      likedByIds: p.likedByIds || [],
      expertAnswer: undefined
    } as import("@/types/community").CommunityPost));
    return [...formattedReal, ...communityPosts];
  }, [realPosts]);

  const visiblePosts = useMemo(() => {
    let filtered = allPosts;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((p) => p.crop === filterCategory);
    }

    switch (activeTab) {
      case "saved":
        return filtered.filter((p) => savedPostIds.has(p.id));
      case "questions":
        return filtered.filter((p) => p.type === "question");
      case "photos":
        return filtered.filter((p) => p.type === "photo" || (p.images && p.images.length > 0));
      case "videos":
        return filtered.filter((p) => p.type === "video");
      case "trending":
        return [...filtered].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
      case "latest":
        return [...filtered].sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      case "following":
        return filtered.filter((p) => (p.author as any).isFollowing || p.author.id === session?.user?.id);
      case "nearby":
        return filtered.filter((p) => p.author.location && p.author.location !== "Local Farm");
      case "for-you":
      default:
        // Default sorting can be a mix, or just return as is (usually chronological from backend)
        return filtered;
    }
  }, [activeTab, allPosts, searchQuery, filterCategory, session?.user?.id, savedPostIds]);

  const categoryByKey = useMemo(
    () => Object.fromEntries(cropCategories.map((c) => [c.key, c])),
    []
  );

  if (status === "loading") {
    return <PageLoader />;
  }

  const fullName = session?.user?.name || "Farmer";
  const avatarUrl = session?.user?.image || null;

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
              farmerFirstName={fullName}
              categories={cropCategories}
              trendingQueries={trendingSearchSuggestions}
              onSearch={handleSearch}
              onCreatePost={handleCreatePostClick}
            />

            <StatsOverview stats={realStats} />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Main feed column */}
              <div className="flex flex-col gap-6 lg:col-span-8">
                <div id="post-composer">
                  <CreatePost
                    authorName={fullName}
                    authorAvatarUrl={avatarUrl || "https://i.pravatar.cc/100?img=12"}
                    categories={cropCategories}
                    onSubmit={handleCreatePost}
                  />
                </div>

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
                            <FeedCard 
                              post={post} 
                              category={post.crop ? categoryByKey[post.crop] : undefined} 
                              index={i} 
                              currentUserId={session?.user?.id}
                              currentUserName={session?.user?.name || "Farmer"}
                              currentUserImage={session?.user?.image || null}
                              onDelete={(id) => setPostToDelete(id)}
                            />
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

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {postToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-outline-variant/50"
            >
              <h3 className="text-xl font-bold text-on-surface mb-2">Delete Post</h3>
              <p className="text-on-surface-variant text-body-md mb-6 leading-relaxed">
                Are you sure you want to permanently delete this post? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPostToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-label-md font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(postToDelete)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl text-label-md font-semibold bg-error text-white hover:bg-error/90 transition-colors flex items-center justify-center min-w-[80px]"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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













