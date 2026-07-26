"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityPost, CropCategory } from "@/types/community";

interface FeedCardProps {
  post: CommunityPost;
  category?: CropCategory;
  index?: number;
}

export function FeedCard({ post, category, index = 0 }: FeedCardProps) {
  const [liked, setLiked] = useState(!!post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(!!post.isBookmarked);
  const [following, setFollowing] = useState(!!post.author.isFollowing);
  const [expanded, setExpanded] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const isLong = post.description.length > 220;
  const shownDescription =
    isLong && !expanded ? post.description.slice(0, 220).trimEnd() + "…" : post.description;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="group relative flex overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Signature: seed-packet spine, colored per crop category */}
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
              <p className="text-label-sm text-outline">
                {post.author.location} · {post.postedAt}
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
          <h4 className="mb-2 font-headline-md text-lg font-bold text-on-surface">{post.title}</h4>
        )}
        <p className="mb-3 whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant">
          {translated ? shownDescription : shownDescription}
        </p>
        {isLong && (
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
              <div key={src} className="relative aspect-video cursor-zoom-in overflow-hidden bg-surface-container">
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
        {post.poll && <PollBlock poll={post.poll} />}

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
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
            {post.comments}
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <Share2 className="h-[18px] w-[18px]" aria-hidden="true" />
            {post.shares}
          </button>

          <button
            type="button"
            onClick={() => setTranslated((v) => !v)}
            aria-pressed={translated}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-label-md transition-colors",
              translated ? "text-primary" : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <Languages className="h-[18px] w-[18px]" aria-hidden="true" />
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
              onClick={() => setBookmarked((v) => !v)}
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
      </div>
    </motion.article>
  );
}

function PollBlock({ poll }: { poll: CommunityPost["poll"] }) {
  const [votedId, setVotedId] = useState<string | null>(null);
  if (!poll) return null;

  return (
    <div className="mb-4 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
      <p className="mb-3 text-label-md font-label-md text-on-surface">{poll.question}</p>
      <div className="flex flex-col gap-2">
        {poll.options.map((opt) => {
          const pct = Math.round((opt.votes / Math.max(poll.totalVotes, 1)) * 100);
          const isVoted = votedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setVotedId(opt.id)}
              className="relative overflow-hidden rounded-lg border border-outline-variant/40 px-3 py-2 text-left text-label-md"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: votedId ? `${pct}%` : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn("absolute inset-y-0 left-0", isVoted ? "bg-primary/25" : "bg-surface-container-high")}
              />
              <span className="relative flex items-center justify-between text-on-surface">
                {opt.label}
                {votedId && <span className="text-label-sm text-outline">{pct}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-label-sm text-outline">
        {poll.totalVotes.toLocaleString()} votes
        {poll.closesInHours ? ` · closes in ${poll.closesInHours}h` : ""}
      </p>
    </div>
  );
}
