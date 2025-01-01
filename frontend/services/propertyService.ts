// services/propertyService.ts
import { MapBounds, Property } from "@/types/types";

export interface SearchOptions {
  bounds: MapBounds;
  mode: "rent" | "sale";
  page?: number;
  limit?: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    propertyType?: string;
  };
  sortOrder?: "asc" | "desc";
}

export async function fetchProperties(options: SearchOptions) {
  const params = new URLSearchParams({
    minLat: options.bounds.south.toString(),
    maxLat: options.bounds.north.toString(),
    minLng: options.bounds.west.toString(),
    maxLng: options.bounds.east.toString(),
    isForRent: (options.mode === "rent").toString(),
    isForSale: (options.mode === "sale").toString(),
    listingStatus: "true",
    ...(options.page && { page: options.page.toString() }),
    ...(options.limit && { limit: options.limit.toString() }),
    ...(options.filters?.propertyType &&
      options.filters.propertyType !== "all" && {
        propertyType: options.filters.propertyType,
      }),
    ...(options.filters?.minPrice && {
      minPrice: options.filters.minPrice.toString(),
    }),
    ...(options.filters?.maxPrice && {
      maxPrice: options.filters.maxPrice.toString(),
    }),
    ...(options.filters?.beds && { beds: options.filters.beds.toString() }),
    ...(options.filters?.baths && { baths: options.filters.baths.toString() }),
    ...(options.sortOrder && {
      sortBy: "price",
      sortOrder: options.sortOrder,
    }),
  });

  const response = await fetch(
    `https://zolo-production.up.railway.app/api/properties/search?${params}`
  );
  if (!response.ok) throw new Error("Failed to fetch properties");
  return response.json();
}

export async function fetchAllMapPins(
  bounds: MapBounds,
  mode: "rent" | "sale"
): Promise<Property[]> {
  try {
    const params = new URLSearchParams({
      minLat: bounds.south.toString(),
      maxLat: bounds.north.toString(),
      minLng: bounds.west.toString(),
      maxLng: bounds.east.toString(),
      listingStatus: "true",
      isForRent: (mode === "rent").toString(),
      isForSale: (mode === "sale").toString(),
      limit: "1000", // Get all pins for the current view
      fieldsOnly: "id,lat,long,price",
    });

    const response = await fetch(
      `https://zolo-production.up.railway.app/api/properties/search?${params}`
    );
    if (!response.ok) throw new Error("Failed to fetch map pins");
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error("Error fetching map pins:", error);
    return [];
  }
}
