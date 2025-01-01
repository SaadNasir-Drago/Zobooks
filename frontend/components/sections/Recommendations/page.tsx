"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { io } from "socket.io-client";
import { PropertyCard } from "../../common/Card/PropertyCard";

// Define the Property type
interface Property {
  _id: string;
  address: string;
  price: number;
  bath: number;
  bed: number;
  size: number;
  description: string;
  images: string[];
  propertyType: string;
  lat: number;
  long: number;
  isForRent: boolean;
  isForSale: boolean;
  amenities: string[];
  listingStatus: boolean;
  createdAt: string;
}

// Create a singleton socket instance
const socket = io("https://zolo-production.up.railway.app");

const Recommendations = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://zolo-production.up.railway.app/api/property"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        const propertiesData = data.properties || data;
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // WebSocket event listener
    socket.on("newProperty", (newProperty: Property) => {
      setProperties((prevProperties) => [newProperty, ...prevProperties]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("newProperty");
    };
  }, []); // Empty dependency array ensures this runs only once

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollContainerRef.current && cardRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = cardRef.current.clientWidth;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scrollContainerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-70">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="relative">
        <h2 className="text-xl font-bold mb-5">Featured Properties</h2>

        {properties.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
            No properties found
          </div>
        ) : (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-hidden scroll-smooth gap-4 h-[450px] cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {properties.map((property) => (
                <div key={property._id} ref={cardRef} className="flex-shrink-0">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
