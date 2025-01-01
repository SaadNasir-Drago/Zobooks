"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PropertyMode } from "@/types/types";
import PropertyModal from "../../common/homedetails/[id]/page";
import { HashLoader } from "react-spinners";

interface Property {
  _id: string;
  address: string;
  price: number;
  lat: number | null;
  long: number | null;
  propertyType: string;
  isForRent: boolean;
  isForSale: boolean;
  bed?: number;
  bath?: number;
  size?: number;
  images?: string[];
  description?: string;
}

interface MapProps {
  onBoundsChange: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  mode: PropertyMode;
  propertyPins?: Property[];
  onMapLoad?: (map: mapboxgl.Map | null) => void;
}

const NY_COORDINATES: [number, number] = [-73.9712, 40.7831];
const DEFAULT_ZOOM = 10;

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9obi1hc3RybyIsImEiOiJjbTJsYzU2aTgwYWIzMmpxeWc3dWV3NjE0In0.tOrWvAEGmI14B0uciQqbSQ";

const Map: React.FC<MapProps> = ({
  onBoundsChange,
  mode,
  propertyPins = [],
  onMapLoad,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFullPropertyDetails = async (propertyId: string) => {
    try {
      const response = await fetch(
        `https://zolo-production.up.railway.app/api/properties/${propertyId}`
      );
      if (!response.ok) throw new Error("Failed to fetch property details");
      return await response.json();
    } catch (error) {
      console.error("Error fetching property details:", error);
      return null;
    }
  };

  const createPropertyPopup = async (property: Property) => {
    const popupContent = document.createElement("div");
    popupContent.className = "property-popup";

    try {
      const fullProperty = await fetchFullPropertyDetails(property._id);
      if (!fullProperty) throw new Error("Failed to load property details");

      popupContent.innerHTML = `
        <div class="bg-white rounded-lg overflow-hidden">
          <div class="relative">
            ${
              fullProperty.images?.[0]
                ? `<img src="/uploads/${fullProperty.images[0]}" 
                      alt="${fullProperty.address}"
                      class="w-full h-48 object-cover"
                   />`
                : '<div class="w-full h-48 bg-gray-200 flex items-center justify-center"><span class="text-gray-400">No image available</span></div>'
            }
            <div class="absolute top-2 left-2 flex gap-2">
              ${
                fullProperty.isForSale
                  ? '<span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">For Sale</span>'
                  : ""
              }
              ${
                fullProperty.isForRent
                  ? '<span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">For Rent</span>'
                  : ""
              }
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 truncate">${fullProperty.address}</h3>
            <p class="text-2xl font-bold text-gray-900 mb-3">$${fullProperty.price.toLocaleString()}</p>
            <div class="flex items-center gap-4 text-gray-600 text-sm mb-4">
              ${fullProperty.bed ? `<span>${fullProperty.bed} beds</span>` : ""}
              ${fullProperty.bath ? `<span>${fullProperty.bath} baths</span>` : ""}
              ${fullProperty.size ? `<span>${fullProperty.size.toLocaleString()} sqft</span>` : ""}
            </div>
            <div class="flex items-center gap-2 mb-4">
              <span class="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">${fullProperty.propertyType}</span>
            </div>
            <button 
              onclick="document.dispatchEvent(new CustomEvent('viewPropertyDetails', {detail: '${fullProperty._id}'}))"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              View Details
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching property details:", error);
      popupContent.innerHTML = `
        <div class="p-4">
          <p class="text-red-500">Error loading property details</p>
        </div>
      `;
    }

    return popupContent;
  };

  useEffect(() => {
    const handleViewPropertyDetails = async (event: CustomEvent<string>) => {
      try {
        const fullProperty = await fetchFullPropertyDetails(event.detail);
        if (fullProperty) {
          setSelectedProperty(fullProperty);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error opening property details:", error);
      }
    };

    document.addEventListener(
      "viewPropertyDetails",
      handleViewPropertyDetails as EventListener
    );
    return () => {
      document.removeEventListener(
        "viewPropertyDetails",
        handleViewPropertyDetails as EventListener
      );
    };
  }, []);

  const updateMarkers = useCallback(() => {
    if (!map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    propertyPins.forEach((property) => {
      if (property.lat !== null && property.long !== null) {
        const el = document.createElement("div");
        el.className = "marker";

        const markerHtml = `
          <div style="
            width: 20px;
            height: 20px;
            background-color: ${mode === "rent" ? "#3B82F6" : "#10B981"};
            position: relative;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            top: -20px;
            left: 50%;
            margin-left: -10px;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              position: absolute;
              border-radius: 50%;
              top: 50%;
              left: 50%;
              margin: -4px 0 0 -4px;
              transform: rotate(45deg);
            "></div>
          </div>
        `;

        el.innerHTML = markerHtml;
        el.style.cursor = "pointer";

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: "300px",
          className: "property-popup",
        });

        el.addEventListener("click", async () => {
          popup.setDOMContent(await createPropertyPopup(property));
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([property.long, property.lat])
          .setPopup(popup)
          .addTo(map.current);

        markers.current.push(marker);
      }
    });
  }, [propertyPins, mode]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: NY_COORDINATES,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
      });

      map.current = newMap;

      if (onMapLoad) {
        onMapLoad(newMap);
      }

      newMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      newMap.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        "bottom-right"
      );

      newMap.on("load", () => {
        const bounds = newMap.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      });

      newMap.on("moveend", () => {
        if (!map.current) return;
        const bounds = map.current.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map. Please check your configuration.");
    }

    return () => {
      if (map.current) {
        if (onMapLoad) {
          onMapLoad(null);
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, [onBoundsChange, onMapLoad]);

  useEffect(() => {
    updateMarkers();
  }, [propertyPins, updateMarkers]);

  return (
    <div className="relative h-full w-full bg-white">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center">
              <HashLoader color="#4A90E2" loading={loading} size={50} />
            </div>
          </div>
        </div>
      )}
      {mapError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
            {mapError}
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
};

export default Map;
