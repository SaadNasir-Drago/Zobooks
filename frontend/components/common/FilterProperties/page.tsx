// FilterProperties.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { PropertyCard } from "../Card/PropertyCard";
import InlineFilters from "../Filters/InlineFilters";
import MobileFilterPanel from "../Filters/MobileFilterPanel";
import { PropertyMode } from "@/types/types";
import debounce from "lodash.debounce";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface Property {
  _id: string;
  address: string;
  price: number;
  lat: number | null;
  long: number | null;
  propertyType: string;
  isForRent: boolean;
  isForSale: boolean;
}

interface Props {
  mode: PropertyMode;
  mapBounds: MapBounds | null;
  onLocationSearch: (searchTerm: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 5;
const SEARCH_DEBOUNCE_MS = 300;

const FilterProperties: React.FC<Props> = ({
  mode,
  mapBounds,
  onLocationSearch,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000000,
    beds: 0,
    baths: 0,
  });

  // Sorting states
  const [sortField, setSortField] = useState<"price" | "createdAt">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [propertyType, setPropertyType] = useState("all");

  const fetchProperties = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (!mapBounds) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          minLat: mapBounds.south.toString(),
          maxLat: mapBounds.north.toString(),
          minLng: mapBounds.west.toString(),
          maxLng: mapBounds.east.toString(),
          isForRent: (mode === "rent").toString(),
          isForSale: (mode === "sale").toString(),
          listingStatus: "true",
          sortBy: sortField,
          sortOrder: sortOrder,
          ...(propertyType !== "all" && { propertyType }),
          ...(filters.minPrice > 0 && {
            minPrice: filters.minPrice.toString(),
          }),
          ...(filters.maxPrice < 1000000 && {
            maxPrice: filters.maxPrice.toString(),
          }),
          ...(filters.beds > 0 && { beds: filters.beds.toString() }),
          ...(filters.baths > 0 && { baths: filters.baths.toString() }),
        });

        const response = await fetch(
          `https://zolo-production.up.railway.app/api/properties/search?${params}`
        );
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();

        if (append) {
          setProperties((prev) => [...prev, ...data.properties]);
        } else {
          setProperties(data.properties);
        }
        setTotalCount(data.total);
        setHasMore(data.hasMore);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [mapBounds, mode, propertyType, filters, sortField, sortOrder]
  );

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.length < 2) return;

      setIsSearching(true);
      try {
        await onLocationSearch(value);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS),
    [onLocationSearch]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const handlePriceChange = (order: "asc" | "desc") => {
    setSortField("price");
    setSortOrder(order);
  };

  const handleRecencyChange = (order: "newest" | "oldest") => {
    setSortField("createdAt");
    setSortOrder(order === "newest" ? "desc" : "asc");
  };

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      fetchProperties(page, true);
    }
  }, [page, fetchProperties]);

  useEffect(() => {
    setProperties([]);
    setPage(1);
    setHasMore(true);
    fetchProperties(1, false);
  }, [
    propertyType,
    filters,
    sortField,
    sortOrder,
    mode,
    mapBounds,
    fetchProperties,
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by address, city, or ZIP code..."
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
            {searchTerm && !isSearching && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-2 top-2.5"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="w-5 h-5 absolute right-2 top-2.5 text-blue-500 animate-spin" />
            )}
          </div>
          <div className="md:hidden">
            <MobileFilterPanel
              filters={filters}
              onFilterChange={setFilters}
              showFilters={showMobileFilters}
              onToggleFilters={() => setShowMobileFilters(!showMobileFilters)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <span className="text-gray-600">
            {totalCount} {mode === "rent" ? "Rentals" : "Sale"}
          </span>
          <InlineFilters
            onPriceChange={handlePriceChange}
            onRecencyChange={handleRecencyChange}
            onTypeChange={setPropertyType}
            selectedPrice={sortField === "price" ? sortOrder : "asc"}
            selectedRecency={
              sortField === "createdAt"
                ? sortOrder === "desc"
                  ? "newest"
                  : "oldest"
                : "newest"
            }
            selectedType={propertyType}
          />
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
        {error ? (
          <div className="text-center text-red-500 mt-8">{error}</div>
        ) : properties.length === 0 && !loading ? (
          <div className="text-center text-gray-500 mt-8">
            No properties found in this area
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  mode={mode}
                />
              ))}
            </div>
            {loading && (
              <div className="text-center my-4">
                <Loader2 className="w-6 h-6 animate-spin inline-block text-blue-500" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilterProperties;
