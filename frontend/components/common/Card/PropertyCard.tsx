import React, { useState } from "react";
import { Property } from "../../../types/types";
import PropertyModal from "../../common/homedetails/[id]/page";
import DashboardPropertyModal from "./DashboardPropertyModal";
import { usePathname } from "next/navigation";

interface PropertyCardProps {
  property: Property;
  onDelete?: (deletedPropertyId: string) => void; // Accept onDelete prop from parent
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = '/properties' === pathname;

  return (
    <>
      <div
        className="min-w-[300px] h-[400px] flex-shrink-0 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Property Image */}
        <div className="relative h-3/5">
          <img
            src={`/uploads/${property.images[0]}`}
            alt={`Property at ${property.address}`}
            className="w-full h-full object-cover rounded-t-lg"
          />
          {/* For Sale or For Rent Badges */}
          {property.isForSale && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
              For Sale
            </div>
          )}
          {property.isForRent && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
              For Rent
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4 flex-grow flex flex-col justify-end">
          <div className="text-2xl font-bold mb-2">
            ${property.price.toLocaleString()}
          </div>
          <div className="flex gap-4 text-gray-600 mb-2">
            <span>{property.bed} beds</span>
            <span>{property.bath} baths</span>
            <span>{property.size} sqft</span>
            <span>{property.propertyType}</span>
          </div>
          <div className="text-gray-800 mb-2 truncate">
            {property.address || "Address not provided"}
          </div>
          <div className="text-xs text-gray-500">
            {property.isForSale ? "For Sale" : ""}
            {property.isForRent && property.isForSale ? " & " : ""}
            {property.isForRent ? "For Rent" : ""}
          </div>
        </div>
      </div>

      {isDashboard && property._id ? (
        <DashboardPropertyModal
          property={property as Required<Property>}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={onDelete} // Pass onDelete to modal
        />
      ) : (
        <PropertyModal
          property={property}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
