import { MapPin, Navigation } from "lucide-react";
import type { NearbyFarmer } from "@/types/community";

interface NearbyFarmersProps {
  farmers: NearbyFarmer[];
}

export function NearbyFarmers({ farmers }: NearbyFarmersProps) {
  return (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-headline-md text-lg font-bold text-on-surface">Nearby Farmers</h3>
        <MapPin className="h-4 w-4 text-outline" aria-hidden="true" />
      </div>

      {/* Map placeholder — swap for a real map component (e.g. Mapbox/Leaflet) later */}
      <div className="mb-4 flex aspect-[16/9] items-center justify-center rounded-lg bg-surface-container-low">
        <div className="flex flex-col items-center gap-1 text-outline">
          <Navigation className="h-5 w-5" aria-hidden="true" />
          <span className="text-label-sm">Map view placeholder</span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {farmers.map((f) => (
          <li key={f.id} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img src={f.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
              {f.online && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-label-md font-label-md text-on-surface">{f.name}</p>
              <p className="text-label-sm text-outline">{f.crop}</p>
            </div>
            <span className="shrink-0 text-label-sm text-outline">{f.distanceKm} km</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
