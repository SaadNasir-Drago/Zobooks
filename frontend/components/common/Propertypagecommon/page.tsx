"use client";
import React, { useState, useCallback, useRef } from "react";
import Map from "@/components/common/Map/page";
import FilterProperties from "@/components/common/FilterProperties/page";
import type { Map as MapboxMap } from "mapbox-gl";
import { fetchAllMapPins } from "@/services/propertyService";
import { HashLoader } from "react-spinners";  // Import HashLoader

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

const PropertyPage = ({ mode }: { mode: "rent" | "sale" }) => {
  const mapRef = useRef<MapboxMap | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [propertyPins, setPropertyPins] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyPins = useCallback(
    async (bounds: MapBounds) => {
      setLoading(true);  // Set loading to true when fetching pins
      const pins = await fetchAllMapPins(bounds, mode);
      setPropertyPins(pins);
      setLoading(false);  // Set loading to false when done
    },
    [mode]
  );

  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      setMapBounds(bounds);
      fetchPropertyPins(bounds);
    },
    [fetchPropertyPins]
  );

  const handleLocationSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm || !mapRef.current) return;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchTerm
          )}.json?access_token=pk.eyJ1Ijoiam9obi1hc3RybyIsImEiOiJjbTJsYzU2aTgwYWIzMmpxeWc3dWV3NjE0In0.tOrWvAEGmI14B0uciQqbSQ&country=US&types=address,postcode,place`
        );

        if (!response.ok) throw new Error("Geocoding failed");

        const data = await response.json();
        const firstResult = data.features?.[0];

        if (firstResult) {
          const [lng, lat] = firstResult.center;
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 13,
            essential: true,
          });

          const searchBounds = {
            north: lat + 0.1,
            south: lat - 0.1,
            east: lng + 0.1,
            west: lng - 0.1,
          };

          await fetchPropertyPins(searchBounds);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    },
    [fetchPropertyPins]
  );

  const setMapReference = useCallback((map: MapboxMap | null) => {
    mapRef.current = map;
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 relative">
        {/* Display loading spinner while fetching properties or map */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white opacity-50 z-10">
            {/* <HashLoader color="#4A90E2" loading={loading} size={50} /> */}
          </div>
        )}
        <Map
          onBoundsChange={handleBoundsChange}
          mode={mode}
          propertyPins={propertyPins}
          onMapLoad={setMapReference}
        />
      </div>
      <div className="w-[600px] border-l border-gray-200">
        <FilterProperties
          mode={mode}
          mapBounds={mapBounds}
          onLocationSearch={handleLocationSearch}
        />
      </div>
    </div>
  );
};

export default PropertyPage;