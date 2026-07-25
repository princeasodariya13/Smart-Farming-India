"use client";

import { motion } from "framer-motion";
import { MapPin, CalendarDays, ShieldCheck, Pencil, Share2 } from "lucide-react";
import type { FarmerProfile } from "@/types/profile";

interface ProfileHeaderProps {
  profile?: FarmerProfile;
  onEdit?: () => void;
  onShare?: () => void;
}

const defaultProfile: FarmerProfile = {
  name: "Rajesh Kumar",
  avatarUrl:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop",
  coverUrl:
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop",
  verification: "verified",
  memberSince: "Jan 2022",
  farmerId: "SFI-KAR-4521",
  location: "Karnal, Haryana, India",
  phone: "+91 98765 43210",
  email: "rajesh.k@kisanadmin.in",
  preferredLanguage: "Hindi / English",
  farmType: "Mixed Crop & Dairy",
  totalLandAcres: 12.5,
  bio: "Third-generation farmer growing wheat, rice and sugarcane. Passionate about sustainable irrigation and organic soil health.",
};

export default function ProfileHeader({
  profile = defaultProfile,
  onEdit,
  onShare,
}: ProfileHeaderProps) {
  return (
    <section className="relative rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="relative h-32 md:h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.coverUrl}
          alt="Farm cover banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="px-6 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-14 md:-mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative shrink-0"
          >
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={`Profile photo of ${profile.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              aria-label="Edit profile photo"
              onClick={onEdit}
              className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform"
            >
              <Pencil size={14} />
            </button>
          </motion.div>

          <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface">{profile.name}</h1>
              {profile.verification === "verified" && (
                <span className="self-center md:self-auto px-3 py-1 bg-primary text-white text-[10px] uppercase font-bold tracking-widest rounded-full shadow-sm">
                  Verified Farmer
                </span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-on-surface-variant mt-1.5">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="text-sm">{profile.location}</span>
              <span className="text-xs text-on-surface-variant/70">· ID {profile.farmerId}</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-medium">
                <CalendarDays size={16} className="text-primary" /> Joined {profile.memberSince}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-medium">
                <ShieldCheck size={16} className="text-primary" /> Identity Verified
              </div>
              <div className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-medium">
                {profile.farmType}
              </div>
              <div className="px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-medium">
                {profile.totalLandAcres} Acres owned
              </div>
            </div>

            <p className="text-sm text-on-surface-variant mt-4 max-w-xl">{profile.bio}</p>
          </div>

          <div className="flex gap-3 pt-4 md:pt-0 shrink-0">
            <button
              type="button"
              onClick={onShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant text-on-surface font-medium text-sm rounded-xl hover:bg-surface-container-low transition-colors shadow-sm"
            >
              <Share2 size={16} /> Share Profile
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium text-sm rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <Pencil size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
