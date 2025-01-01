"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/page";
import Cookies from "js-cookie";
import { Property } from "@/types/types";
import { useRouter } from "next/navigation";
interface PropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (propertyId: string) => void;
}
const DashboardPropertyModal: React.FC<PropertyModalProps> = ({
  property,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (property.images?.length || 1));
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property.images?.length || 1) - 1 : prev - 1
    );
  };
  // Handle Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `https://zolo-production.up.railway.app/api/properties/${property._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("Property deleted successfully.");
        onDelete(property._id); // Notify the parent to update the state
        onClose(); // Close the modal after deletion
        window.location.reload();
      } else {
        alert("Failed to delete property.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] overflow-y-auto flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            {property.address || "Address not provided"}
          </DialogTitle>
        </DialogHeader>
        {/* Image Gallery */}
        <div className="relative w-full h-[60%] mb-6">
          <img
            src={`/uploads/${property?.images[currentImageIndex]}`}
            alt={`Property at ${property.address}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="bg-white/80 hover:bg-white"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-grow p-4 flex flex-col justify-end">
          <div className="text-3xl font-bold mb-2">
            ${property.price?.toLocaleString() || "N/A"}
          </div>
          <div className="flex gap-4 text-gray-600 mb-2">
            <span>{property.bed} beds</span>
            <span>{property.bath} baths</span>
            <span>{property.size} sqft</span>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">About this home</h3>
            <p className="text-gray-600">
              {property.description || "No description available."}
            </p>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-4 justify-between mt-6">
          <Button
            variant="destructive"
            color="primary"
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white font-semibold"
          >
            Delete Property
          </Button>
          <Button
            variant="outline"
            color="primary"
            onClick={() => router.push(`/update-listing/${property._id}`)}
            className="flex-1 bg-blue-600 text-white font-semibold"
          >
            Edit Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default DashboardPropertyModal;
