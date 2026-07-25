export type VerificationStatus = "verified" | "pending" | "unverified";
export type EquipmentStatus = "available" | "rented" | "maintenance";
export type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "failed";
export type AddressType = "home" | "farm" | "warehouse";
export type PaymentMethodType = "upi" | "credit_card" | "debit_card" | "bank_account";
export type AchievementTier = "bronze" | "silver" | "gold";

export interface FarmerProfile {
  name: string;
  avatarUrl: string;
  coverUrl: string;
  verification: VerificationStatus;
  memberSince: string;
  farmerId: string;
  location: string;
  phone: string;
  email: string;
  preferredLanguage: string;
  farmType: string;
  totalLandAcres: number;
  bio: string;
}

export interface ProfileStat {
  id: string;
  label: string;
  value: number;
  icon: string;
}

export interface PersonalInfo {
  fullName: string;
  mobile: string;
  email: string;
}

export interface FarmInfo {
  id: string;
  farmName: string;
  cropTypes: string[];
  soilType: string;
  irrigationMethod: string;
  farmSizeAcres: number;
  livestock: string;
  organicCertified: boolean;
  gpsLocation: string;
}

export interface EquipmentItem {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
  status: EquipmentStatus;
  rentalPricePerDay: number;
  availability: string;
  earnings: number;
}

export interface TimelineEvent {
  id: string;
  type:
    | "purchase"
    | "rental"
    | "scan"
    | "weather"
    | "scheme"
    | "community"
    | "payment";
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string;
  product: string;
  status: OrderStatus;
  amount: number;
  payment: PaymentStatus;
  date: string;
}

export interface Address {
  id: string;
  type: AddressType;
  label: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  maskedDetail: string;
  isDefault?: boolean;
}

export interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface SecurityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  actionLabel: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  earned: boolean;
}

export interface AccountSetting {
  id: string;
  label: string;
  value: string;
  icon: string;
  destructive?: boolean;
}
