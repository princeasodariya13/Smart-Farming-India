"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Bookmark,
  Flag,
  Heart,
  Languages,
  MessageCircle,
  MoreHorizontal,
  Play,
  Share2,
  UserPlus,
  UserCheck,
  Send,
  Loader2,
  MapPin,
  BarChart2,
  Trash2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityPost, CropCategory } from "@/types/community";

interface FeedCardProps {
  post: CommunityPost;
  category?: CropCategory;
  index?: number;
  currentUserId?: string;
  currentUserName?: string;
  currentUserImage?: string | null;
  onDelete?: (postId: string) => void;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "F";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length-1][0]}`.toUpperCase();
  return name[0].toUpperCase();
}

function formatTimeAgo(dateString: string) {
  if (dateString === "Just now" || dateString.includes("ago")) return dateString;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function FeedCard({ 
  post, 
  category, 
  index = 0, 
  currentUserId, 
  currentUserName = "Farmer", 
  currentUserImage = null, 
  onDelete 
}: FeedCardProps) {
  const isActuallyLiked = (currentUserId && post.likedByIds?.includes(currentUserId)) || post.isLiked || false;
  const [liked, setLiked] = useState(isActuallyLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);

  // Load persistent local states
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLikes = JSON.parse(localStorage.getItem("sf_likes") || "[]");
      if (post.id.startsWith("post-") && savedLikes.includes(post.id)) {
        setLiked(true);
        // If it was already in our mock data as not liked but locally it is, increase count
        if (!post.isLiked) setLikeCount(post.likes + 1);
      }
      
      const savedBookmarks = JSON.parse(localStorage.getItem("sf_bookmarks") || "[]");
      if (savedBookmarks.includes(post.id)) {
        setBookmarked(true);
      }
    }
  }, [post.id, post.isLiked, post.likes]);

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : c - 1));
    
    // Persist to local storage
    const savedLikes = JSON.parse(localStorage.getItem("sf_likes") || "[]");
    if (newLiked) {
      localStorage.setItem("sf_likes", JSON.stringify([...new Set([...savedLikes, post.id])]));
    } else {
      localStorage.setItem("sf_likes", JSON.stringify(savedLikes.filter((id: string) => id !== post.id)));
    }

    if (!post.id.startsWith("post-")) {
      try {
        const res = await fetch("/api/community/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id }),
        });
        const data = await res.json();
        if (data.success && typeof data.likes === 'number') {
          setLikeCount(data.likes);
        }
      } catch {}
    }
  };

  const toggleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    const savedBookmarks = JSON.parse(localStorage.getItem("sf_bookmarks") || "[]");
    let newBookmarks = [];
    if (newBookmarked) {
      newBookmarks = [...new Set([...savedBookmarks, post.id])];
    } else {
      newBookmarks = savedBookmarks.filter((id: string) => id !== post.id);
    }
    localStorage.setItem("sf_bookmarks", JSON.stringify(newBookmarks));
    window.dispatchEvent(new Event("saved_posts_changed"));
  };

  const toggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0 && !post.id.startsWith("post-")) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/community/comment?postId=${post.id}`);
        const data = await res.json();
        if (data.success) setComments(data.comments);
      } catch {}
      setLoadingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      if (!post.id.startsWith("post-")) {
        const res = await fetch("/api/community/comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id, content: commentText }),
        });
        const data = await res.json();
        if (data.success) {
          setComments((prev) => [...prev, data.comment]);
          setCommentCount((c) => c + 1);
        }
      } else {
        setComments((prev) => [
          ...prev, 
          { 
            id: Date.now(), 
            content: commentText, 
            user: { name: currentUserName, image: currentUserImage }, 
            createdAt: new Date().toISOString() 
          }
        ]);
        setCommentCount((c) => c + 1);
      }
      setCommentText("");
    } catch {}
    setPostingComment(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post.title || "Community Post", text: post.description, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleTranslate = async () => {
    if (translated) {
      setTranslated(false);
      return;
    }
    setTranslating(true);
    
    try {
      // If we already translated this before, just show it
      if (translatedText) {
        setTranslated(true);
        return;
      }
      
      const translateApi = async (text: string) => {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|gu`);
        const data = await res.json();
        return data.responseData?.translatedText || text;
      };

      const [descResponse, titleResponse] = await Promise.all([
        translateApi(post.description),
        post.title ? translateApi(post.title) : Promise.resolve(null)
      ]);

      setTranslatedText(descResponse);
      if (titleResponse) setTranslatedTitle(titleResponse);
      setTranslated(true);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setTranslating(false);
    }
  };

  const isLong = post.description.length > 220;
  const shownDescription =
    isLong && !expanded ? post.description.slice(0, 220).trimEnd() + "…" : post.description;
    
  const displayDescription = translated && translatedText ? translatedText : shownDescription;
  const displayTitle = translated && translatedTitle ? translatedTitle : post.title;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.35, ease: "easeOut" }}
      className="group relative flex overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className={cn("w-1.5 shrink-0", category?.accent.spine ?? "bg-outline-variant")}
        aria-hidden="true"
      />

      <div className="flex-1 p-5 sm:p-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <img
              src={post.author.avatarUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-label-md font-label-md text-on-surface">{post.author.name}</h3>
                {post.author.verified && (
                  <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified farmer" />
                )}
                {category && (
                  <span className={cn("rounded-full px-2 py-0.5 text-label-sm", category.accent.bg, category.accent.text)}>
                    {category.label}
                  </span>
                )}
                {post.isSolved && (
                  <span className="rounded-full bg-success-soft px-2 py-0.5 text-label-sm text-primary">
                    Solved
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-label-sm text-outline flex items-center gap-1 flex-wrap">
                {post.author.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {post.author.location} <span className="mx-0.5">·</span>
                  </span>
                )}
                {formatTimeAgo(post.postedAt)}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Post options"
              className="rounded-full p-1.5 text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest shadow-lg"
                >
                  {currentUserId === post.author.id && (
                    <button
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-label-md text-error hover:bg-surface-container-high"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete?.(post.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete post
                    </button>
                  )}
                  <button
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-label-md text-error hover:bg-surface-container-high"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Flag className="h-4 w-4" aria-hidden="true" />
                    Report post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Body */}
        {post.title && (
          <h4 className={cn("mb-2 font-headline-md text-lg font-bold text-on-surface transition-all duration-300", translating && "blur-sm animate-pulse opacity-70")}>
            {displayTitle}
          </h4>
        )}
        
        {post.description && (
          <p className={cn("mb-3 whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant transition-all duration-300", translating && "blur-sm animate-pulse opacity-70")}>
            {displayDescription}
          </p>
        )}
        
        {isLong && !translated && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mb-3 text-label-md font-label-md text-primary hover:underline"
          >
            {expanded ? "Show less" : "Read More"}
          </button>
        )}

        {/* Image gallery */}
        {post.images && post.images.length > 0 && (
          <div
            className={cn(
              "mb-4 grid gap-1.5 overflow-hidden rounded-xl",
              post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {post.images.slice(0, 4).map((src, i) => (
              <div 
                key={src} 
                className="relative aspect-video cursor-zoom-in overflow-hidden bg-surface-container"
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt={`${post.title ?? "Post"} image ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Video placeholder */}
        {post.type === "video" && post.videoThumbnailUrl && (
          <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-black/80">
            <img src={post.videoThumbnailUrl} alt="" className="h-full w-full object-cover opacity-80" />
            <button
              type="button"
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105">
                <Play className="ml-0.5 h-6 w-6 fill-on-surface text-on-surface" aria-hidden="true" />
              </span>
            </button>
          </div>
        )}

        {/* Poll placeholder */}
        {post.poll && <PollBlock poll={post.poll} description={post.description} postId={post.id} />}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-outline-variant/20 pt-3">
          <motion.button
            type="button"
            onClick={toggleLike}
            whileTap={{ scale: 0.85 }}
            aria-pressed={liked}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md transition-colors",
              liked ? "text-error" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <Heart className={cn("h-[18px] w-[18px]", liked && "fill-error")} aria-hidden="true" />
            {likeCount}
          </motion.button>

          <button
            type="button"
            onClick={toggleComments}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md transition-colors",
              showComments ? "text-primary bg-primary/5" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
            {commentCount}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
            Share
          </button>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={translating}
            aria-pressed={translated}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md transition-colors",
              translated ? "text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            {translating ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin text-primary" aria-hidden="true" />
            ) : (
              <Languages className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
            Translate
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFollowing((v) => !v)}
              className={cn(
                "hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-sm transition-colors sm:flex",
                following
                  ? "border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high"
                  : "border-primary text-primary hover:bg-primary/5"
              )}
            >
              {following ? <UserCheck className="h-3.5 w-3.5" aria-hidden="true" /> : <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />}
              {following ? "Following" : "Follow"}
            </button>

            <motion.button
              type="button"
              onClick={toggleBookmark}
              whileTap={{ scale: 0.85 }}
              aria-pressed={bookmarked}
              aria-label="Bookmark post"
              className={cn(
                "rounded-lg p-1.5 transition-colors",
                bookmarked ? "text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Bookmark className={cn("h-[18px] w-[18px]", bookmarked && "fill-primary")} aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* Inline Comment Panel */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-outline-variant/20 pt-4 mt-2"
            >
              {/* Comment input */}
              <div className="flex gap-2 mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePostComment(); } }}
                  rows={1}
                  placeholder="Write a comment... (Gujarati or English)"
                  className="flex-1 resize-none rounded-xl bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                />
                <button
                  onClick={handlePostComment}
                  disabled={!commentText.trim() || postingComment}
                  className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white disabled:opacity-40 transition-all hover:brightness-110"
                >
                  {postingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>

              {/* Comments list */}
              {loadingComments ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-center text-sm text-on-surface-variant py-3">No comments yet. Be the first!</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {comments.map((c: any) => {
                    const initials = getInitials(c.user?.name);
                    return (
                    <div key={c.id} className="flex gap-3">
                      {c.user?.image ? (
                        <img
                          src={c.user.image}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
                          {initials}
                        </div>
                      )}
                      <div className="flex-1 rounded-xl bg-surface-container-low px-3 py-2">
                        <p className="text-xs font-semibold text-on-surface mb-0.5">{c.user?.name || "Farmer"}</p>
                        <p className="text-sm text-on-surface-variant leading-snug">{c.content}</p>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Expanded view"
              className="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}


function PollBlock({ poll, description, postId }: { poll: CommunityPost["poll"], description?: string, postId: string }) {
  const [votedId, setVotedId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedVotes = JSON.parse(localStorage.getItem("sf_poll_votes") || "{}");
        return savedVotes[postId] || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  if (!poll) return null;

  const handleVote = (id: string) => {
    const newVotedId = votedId === id ? null : id;
    setVotedId(newVotedId);
    
    if (typeof window !== "undefined") {
      const savedVotes = JSON.parse(localStorage.getItem("sf_poll_votes") || "{}");
      if (newVotedId) {
        savedVotes[postId] = newVotedId;
      } else {
        delete savedVotes[postId];
      }
      localStorage.setItem("sf_poll_votes", JSON.stringify(savedVotes));
    }
  };

  const showQuestion = poll.question && poll.question !== description && poll.question !== "Poll";

  // Derive the active poll state dynamically to prevent double-counting bugs on strict mode refreshes
  const activeTotalVotes = poll.totalVotes + (votedId ? 1 : 0);

  return (
    <div className="mb-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
      {showQuestion && <p className="mb-3 text-label-md font-label-md text-on-surface">{poll.question}</p>}
      <div className="flex flex-col gap-2">
        {poll.options.map((opt) => {
          const activeOptVotes = (opt.votes || 0) + (votedId === opt.id ? 1 : 0);
          const pct = Math.round((activeOptVotes / Math.max(activeTotalVotes, 1)) * 100);
          const isVoted = votedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleVote(opt.id)}
              className={cn(
                "relative overflow-hidden rounded-lg border px-3 py-2 text-left text-label-md transition-colors",
                isVoted 
                  ? "border-primary/50 ring-1 ring-primary/20" 
                  : "border-outline-variant/40 hover:bg-surface-container-high cursor-pointer"
              )}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn("absolute inset-y-0 left-0", isVoted ? "bg-primary/25" : "bg-surface-container-high")}
              />
              <span className={cn("relative flex items-center justify-between text-on-surface", isVoted && "font-semibold")}>
                {opt.label}
                {(votedId !== null || activeTotalVotes > 0) && (
                  <span className={cn("text-label-sm", isVoted ? "font-bold text-primary" : "text-outline")}>
                    {pct}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-label-sm text-outline">
        <BarChart2 className="h-3.5 w-3.5" />
        {activeTotalVotes.toLocaleString()} votes
        {poll.closesInHours ? ` · closes in ${poll.closesInHours}h` : ""}
      </p>
    </div>
  );
}
