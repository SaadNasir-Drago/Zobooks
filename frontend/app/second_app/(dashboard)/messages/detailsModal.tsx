"use client"
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/page";
import { Property } from "@/types/types";

interface PropertyModalProps {
  property?: Property; // Optional property prop
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] overflow-y-auto flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            {property?.address || "Address not provided"}
          </DialogTitle>
        </DialogHeader>

        {/* Image Gallery */}
        <div className="relative w-full h-[60%] mb-6">
          {property?.images && property.images.length > 0 ? (
            <img
              src={`/uploads/${property.images[currentImageIndex]}`}
              alt={`Property at ${property.address || "No address"}`}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
              <span>No images available</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="bg-white/80 hover:bg-white"
              disabled={!property?.images || property.images.length <= 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="bg-white/80 hover:bg-white"
              disabled={!property?.images || property.images.length <= 1}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 flex flex-col justify-end">
          <div className="text-3xl font-bold mb-2">
            ${property?.price?.toLocaleString() || "N/A"}
          </div>
          <div className="flex gap-4 text-gray-600 mb-2">
            <span>{property?.bed || 0} beds</span>
            <span>{property?.bath || 0} baths</span>
            <span>{property?.size || 0} sqft</span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">About this home</h3>
            <p className="text-gray-600">
              {property?.description || "No description available."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;
