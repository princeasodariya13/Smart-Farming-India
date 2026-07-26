"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ExpertAnswer } from "@/types/community";

interface ExpertAnswerCardProps {
  answer: ExpertAnswer;
}

export function ExpertAnswerCard({ answer }: ExpertAnswerCardProps) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(answer.helpfulVotes);

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-success-soft/40 to-transparent p-5">
      <div className="flex gap-3">
        <img
          src={answer.expert.avatarUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full border-2 border-primary object-cover"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-label-md font-label-md text-on-surface">{answer.expert.name}</h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-label-sm font-bold text-on-primary">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              EXPERT VERIFIED
            </span>
          </div>
          <p className="mb-2 text-label-sm text-primary">{answer.expert.expertQualification}</p>
          <p className="text-body-md leading-relaxed text-on-surface-variant">{answer.answer}</p>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setVoted((v) => !v);
              setVotes((c) => (voted ? c - 1 : c + 1));
            }}
            aria-pressed={voted}
            className={cn(
              "mt-3 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-sm transition-colors",
              voted
                ? "border-primary bg-primary/10 text-primary"
                : "border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <ThumbsUp className={cn("h-3.5 w-3.5", voted && "fill-primary")} aria-hidden="true" />
            {votes} found this helpful
          </motion.button>
        </div>
      </div>
    </div>
  );
}
