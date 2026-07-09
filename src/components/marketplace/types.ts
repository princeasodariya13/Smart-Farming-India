export type ProductType = "buy" | "rental";

export interface Product {
  id: string;
  name: string;
  seller: string;
  location: string;
  rating: number;
  price: number;
  priceUnit: string;
  type: ProductType;
  image: string;
  imageAlt: string;
  category: string;
  stock?: string;
  badge?: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

export type SortOption = "popular" | "price-asc" | "price-desc" | "rating";
export type ViewMode = "grid" | "list";
