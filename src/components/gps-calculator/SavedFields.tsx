"use client";

import FieldCard from "./FieldCard";
import type { SavedField } from "@/types/gps-calculator";

interface SavedFieldsProps {
  fields?: SavedField[];
  total?: number;
  onSelect?: (id: string) => void;
  onMenu?: (id: string) => void;
}

const defaultFields: SavedField[] = [
  {
    id: "f1",
    name: "West Block Wheat",
    cropName: "Wheat",
    areaAcres: 8.2,
    date: "2d ago",
    location: "Ludhiana",
    tags: ["Wheat"],
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f2",
    name: "New Sugarcane Plot",
    cropName: "Sugarcane",
    areaAcres: 14.5,
    date: "1w ago",
    location: "Amritsar",
    tags: ["Sugar"],
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f3",
    name: "Border Perimeter",
    cropName: "—",
    areaAcres: 2.1,
    date: "Oct 12",
    location: "",
    tags: ["Testing"],
    status: "draft",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop",
  },
];

export default function SavedFields({
  fields = defaultFields,
  total = 8,
  onSelect,
  onMenu,
}: SavedFieldsProps) {
  return (
    <div className="border-t border-outline-variant/50 flex flex-col">
      <div className="px-4 py-3 flex justify-between items-center bg-surface-container-lowest/50">
        <h3 className="font-bold text-sm text-on-surface">Saved Fields</h3>
        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
          {total} TOTAL
        </span>
      </div>
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-6 py-10 gap-2">
          <p className="font-semibold text-on-surface">No fields saved yet</p>
          <p className="text-sm text-on-surface-variant">
            Draw a polygon on the map and save it to see it here.
          </p>
        </div>
      ) : (
        <div className="px-3 pb-4 pt-2 space-y-2">
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} onSelect={onSelect} onMenu={onMenu} />
          ))}
        </div>
      )}
    </div>
  );
}
