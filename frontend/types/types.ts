export interface Property {
  _id?: string;
  address?: string;
  price?: number;
  lat?: number;
  long?: number;
  propertyType?: string;
  isForRent?: boolean;
  isForSale?: boolean;
  createdAt?: string;
  bed?: number;
  bath?: number;
  size?: number;
  description?: string;
  images?: string[];
  amenities?: string[];
  listingStatus?: boolean;
}

export type PropertyMode = "rent" | "sale";

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Message Interface
export interface Message {
  _id: string;
  buyerId: string; // Foreign key reference to User table
  sellerId: string; // Foreign key reference to User table
  propertyId: string; // Foreign key reference to Property table
  dealId: string; // Foreign key reference to Deal table
  content: string;
  offer: boolean;
  createdAt?: string; // Timestamp
}

// Deal Interface (previously DealLog)
export interface Deal {
  _id: string;
  buyerId: string; // Foreign key reference to User table
  sellerId: string; // Foreign key reference to User table
  propertyId: string; // Foreign key reference to Property table
  initialPrice: number;
  finalPrice: number;
  offerPrice: number;
  status: "pending" | "accepted" | "rejected"; // Enum for status
  created_at?: string; // Timestamp
}