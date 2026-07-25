"use client";

import { motion } from "framer-motion";
import { Sprout, Plus, BadgeCheck, MapPin } from "lucide-react";
import type { FarmInfo } from "@/types/profile";

interface FarmCardProps {
  farms?: FarmInfo[];
  onAddFarm?: () => void;
}

const defaultFarms: FarmInfo[] = [
  {
    id: "farm1",
    farmName: "Green Fields Farm",
    cropTypes: ["Wheat", "Rice", "Sugarcane"],
    soilType: "Alluvial Loam",
    irrigationMethod: "Drip & Tube-well",
    farmSizeAcres: 8.2,
    livestock: "Dairy Cattle (6)",
    organicCertified: true,
    gpsLocation: "29.6857° N, 76.9907° E",
  },
  {
    id: "farm2",
    farmName: "Riverside Plot",
    cropTypes: ["Sugarcane"],
    soilType: "Clay Loam",
    irrigationMethod: "Canal",
    farmSizeAcres: 4.3,
    livestock: "—",
    organicCertified: false,
    gpsLocation: "29.7011° N, 76.9822° E",
  },
];

export default function FarmCard({ farms = defaultFarms, onAddFarm }: FarmCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <Sprout size={20} className="text-primary" /> Farm Information
        </h2>
        <button
          type="button"
          onClick={onAddFarm}
          className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline"
        >
          <Plus size={14} /> Add Farm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {farms.length === 0 ? (
          <div className="col-span-full py-8 text-center border-2 border-dashed border-outline-variant/60 rounded-2xl bg-surface-container-low/50">
            <Sprout className="mx-auto text-on-surface-variant mb-2 opacity-50" size={32} />
            <p className="text-on-surface-variant font-medium">No farms added yet.</p>
            <p className="text-xs text-on-surface-variant/70 mt-1">Click 'Add Farm' to track your fields.</p>
          </div>
        ) : farms.map((farm) => (
          <motion.div
            key={farm.id}
            whileHover={{ y: -3 }}
            className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/50"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-on-surface">{farm.farmName}</h3>
              {farm.organicCertified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <BadgeCheck size={12} /> Organic
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {farm.cropTypes.map((crop) => (
                <span
                  key={crop}
                  className="text-[10px] bg-white border border-outline-variant px-2 py-0.5 rounded-full text-on-surface-variant"
                >
                  {crop}
                </span>
              ))}
            </div>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Farm Size</dt>
                <dd className="font-medium">{farm.farmSizeAcres} Acres</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Soil Type</dt>
                <dd className="font-medium">{farm.soilType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Irrigation</dt>
                <dd className="font-medium">{farm.irrigationMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Livestock</dt>
                <dd className="font-medium">{farm.livestock}</dd>
              </div>
            </dl>
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-outline-variant/40 text-xs text-on-surface-variant">
              <MapPin size={13} className="text-primary" /> {farm.gpsLocation}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
