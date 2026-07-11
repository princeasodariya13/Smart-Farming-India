export type MapView = "satellite" | "terrain" | "roadmap";
export type DrawTool = "polygon" | "marker" | null;
export type FieldStatus = "active" | "archived" | "draft";
export type GpsStatus = "locked" | "searching" | "unavailable";

export interface Vertex {
  id: string;
  top: string; // percentage position within map container
  left: string;
}

export interface FieldStats {
  totalAreaAcres: number;
  totalAreaHectares: number;
  totalAreaBigha: number;
  totalAreaSqm: number;
  totalAreaSqFt: number;
  totalAreaVar: number;
  perimeterMeters: number;
  vertexCount: number;
}

export interface SavedField {
  id: string;
  name: string;
  cropName: string;
  areaAcres: number;
  date: string;
  location: string;
  tags: string[];
  status: FieldStatus;
  imageUrl: string;
}

export interface AnalyticsSummary {
  totalFields: number;
  totalAreaManaged: number; // acres
  averageFieldSize: number; // acres
  mostGrownCrop: string;
}

export interface RecentMeasurement {
  id: string;
  fieldName: string;
  areaAcres: number;
  timestamp: string;
}
