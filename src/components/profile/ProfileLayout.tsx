"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { X, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import PersonalInfoCard from "./PersonalInfoCard";
import FarmCard from "./FarmCard";
import EquipmentCard from "./EquipmentCard";
import Timeline from "./Timeline";
import OrdersTable from "./OrdersTable";
import AddressCard from "./AddressCard";
import PaymentCard from "./PaymentCard";
import AchievementCard from "./AchievementCard";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ProfileData {
  user: { id: string; name: string | null; email: string | null; image: string | null; createdAt: string };
  stats: { diseaseScans: number; cartItems: number };
  recentScans: { id: string; plant: string; disease: string; confidence: number; date: string }[];
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({
  open,
  onClose,
  currentName,
  currentImage,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  currentName: string;
  currentImage: string;
  onSave: (name: string, image: string) => Promise<void>;
}) {
  const [name, setName] = useState(currentName);
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(currentName);
    setImageUrl(currentImage);
    setStatus("idle");
  }, [currentName, currentImage, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    try {
      await onSave(name, imageUrl);
      setStatus("success");
      setTimeout(onClose, 800);
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/40">
            <h2 className="text-lg font-bold text-on-surface">Edit Profile</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Avatar preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-outline-variant/40 bg-surface-container">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary bg-primary/10">
                      {name?.[0]?.toUpperCase() || "F"}
                    </div>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white">
                  <Camera size={13} />
                </span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Full Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Profile image URL */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Profile Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-on-surface-variant/70 mt-1">
                Paste a direct link to your profile photo (JPG, PNG, WebP).
              </p>
            </div>

            {/* Status */}
            {status === "success" && (
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle size={16} /> Profile updated successfully!
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-error font-medium">
                <AlertCircle size={16} /> Failed to save. Please try again.
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container-low transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" | "info" }) {
  const colors = {
    success: "bg-primary text-white",
    error: "bg-error text-white",
    info: "bg-surface-container-high text-on-surface",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-6 right-6 z-[300] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold ${colors[type]}`}
    >
      {message}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileLayout() {
  const { data: session, update: updateSession } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch real profile data
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProfileData(data);
      })
      .catch(() => showToast("Could not load profile data", "error"))
      .finally(() => setLoading(false));
  }, [session]);

  const handleLogout = () => signOut({ callbackUrl: "/" });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Profile link copied to clipboard!", "success");
    } catch {
      showToast("Could not copy link", "error");
    }
  };

  const handleSaveProfile = async (name: string, image: string) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });
    if (!res.ok) throw new Error("Update failed");
    const data = await res.json();
    // Update next-auth session in the browser
    await updateSession({ name: data.user.name, image: data.user.image });
    // Refresh local profile data
    setProfileData((prev) =>
      prev ? { ...prev, user: { ...prev.user, name: data.user.name, image: data.user.image } } : prev
    );
    showToast("Profile updated!", "success");
  };



  // Derive display data from real session + API
  const displayName = profileData?.user.name || session?.user?.name || "Farmer";
  const displayEmail = profileData?.user.email || session?.user?.email || "";
  const displayImage = profileData?.user.image || session?.user?.image || "";
  const createdAt = profileData?.user.createdAt;
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";
  const userId = profileData?.user.id || session?.user?.id || "";
  const farmerId = userId ? `SFI-${userId.substring(0, 6).toUpperCase()}` : "SFI-USR";

  // Stats from real DB data
  const stats = [
    { id: "scans", label: "Disease Scans", value: profileData?.stats.diseaseScans ?? 0, icon: "scan" },
    { id: "cart", label: "Cart Items", value: profileData?.stats.cartItems ?? 0, icon: "cart" },
  ];

  // Timeline from recent scans
  const timelineEvents = (profileData?.recentScans ?? []).map((scan) => ({
    id: scan.id,
    type: "scan" as const,
    title: `Disease Scan — ${scan.plant}`,
    description: `${scan.disease} detected (${Math.round(scan.confidence * 100)}% confidence)`,
    timestamp: new Date(scan.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  }));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto space-y-8 p-4 md:p-8"
      >
        {/* ── Profile Header ─────────────────────────────────────────── */}
        <ProfileHeader
          profile={{
            name: displayName,
            avatarUrl: displayImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4caf50&color=fff&size=128`,
            email: displayEmail,
            coverUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop",
            verification: "verified",
            memberSince,
            farmerId,
            location: "India",
            phone: "Not provided",
            preferredLanguage: "English",
            farmType: "Smart Farmer",
            totalLandAcres: 0,
            bio: `Managing crops with AI-powered precision. Member since ${memberSince}.`,
          }}
          onEdit={() => setEditOpen(true)}
          onShare={handleShare}
        />

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <ProfileStats stats={stats} />

        {/* ── Cards Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Info — real data from session */}
            <PersonalInfoCard
              info={{
                fullName: displayName,
                mobile: "Not provided",
                email: displayEmail,
              }}
              onEdit={() => setEditOpen(true)}
            />

            {/* Farms — empty, ready to add */}
            <FarmCard farms={[]} />

            {/* Equipment — empty, ready to add */}
            <EquipmentCard items={[]} />

            {/* Orders — empty, ready for marketplace integration */}
            <OrdersTable orders={[]} />

            {/* Addresses */}
            <AddressCard addresses={[]} />

            {/* Payment Methods */}
            <PaymentCard methods={[]} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <AchievementCard achievements={[]} />

            {/* Activity Timeline from real disease scans */}
            <Timeline events={timelineEvents} />
          </div>
        </div>
      </motion.div>

      {/* ── Edit Profile Modal ───────────────────────────────────────── */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        currentName={displayName}
        currentImage={displayImage}
        onSave={handleSaveProfile}
      />

      {/* ── Toast ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast key={toast.message} message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </>
  );
}
