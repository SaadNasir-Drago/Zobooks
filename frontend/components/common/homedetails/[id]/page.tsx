import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Tv,
  Fan,
  Snowflake,
  Wifi,
  Car,
  Bath,
  Power,
  Coffee,
  KeyRound,
} from "lucide-react";
import { Property } from "../../../../types/types";
import { Button } from "@/components/ui/button/page";
import { Notyf } from "notyf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/page";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthModal from "@/components/common/Modal/AuthModal";

interface PropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I am interested in this property...",
  });
  const [formError, setFormError] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const showAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  const router = useRouter();

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      baseboard: <Power className="w-5 h-5" />,
      refrigerator: <Snowflake className="w-5 h-5" />,
      laundry: <Bath className="w-5 h-5" />,
      heatPump: <Fan className="w-5 h-5" />,
      wifi: <Wifi className="w-5 h-5" />,
      parking: <Car className="w-5 h-5" />,
      // garden: <Tree className="w-5 h-5" />,
      tv: <Tv className="w-5 h-5" />,
      // toolshed: <Tool className="w-5 h-5" />,
      coffeemaker: <Coffee className="w-5 h-5" />,
      security: <KeyRound className="w-5 h-5" />,
      default: <Home className="w-5 h-5" />,
    };

    return icons[amenity.toLowerCase()] || icons.default;
  };

  const formatAmenityLabel = (amenity: string) => {
    return amenity
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (property.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property.images?.length || 1) - 1 : prev - 1
    );
  };
  const notyf = new Notyf();

  const handleContactSeller = async () => {
    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        // User is not authenticated, show the auth modal
        showAuthModal();

        return;
      }

      const userData = JSON.parse(decodeURIComponent(userCookie));
      const response = await fetch(
        "https://zolo-production.up.railway.app/api/deal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property._id,
            sellerId: property.userId,
            buyerId: userData._id,
            initialPrice: property.price,
            offerPrice: 0,
            finalPrice: 0,
            status: "ongoing",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create deal");
      }

      await response.json();
      router.push(`/second_app/messages`);
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  const handleRequestInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");

    try {
      const response = await fetch(
        "https://zolo-production.up.railway.app/api/email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property._id, // Send property ID to the backend
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        }
      );

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "I am interested in this property...",
        });
        notyf.success("Email sent successfully");
        setLoading(false);
      } else {
        notyf.error("Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send email", error);
      alert("Failed to send email.");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[90vh] overflow-y-auto flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {property.address || "Address not provided"}
            </DialogTitle>
          </DialogHeader>

          {/* Image Gallery */}
          <div className="relative w-full h-[60%] mb-6">
            <img
              src={`/uploads/${property.images[currentImageIndex]}`}
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

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="text-gray-700">
                        {formatAmenityLabel(amenity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact With Seller Section */}
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-semibold mb-4">Contact With Seller</h3>

            <form className="space-y-4" onSubmit={handleRequestInfo}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <textarea
                name="message"
                placeholder="I am interested in this property..."
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24"
              />
              {formError && <p className="text-red-500">{formError}</p>}

              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Request info
                </Button>
              )}
            </form>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              onClick={handleContactSeller}
            >
              Contact Seller
            </Button>
          </div>
          <AuthModal isOpen={isAuthModalOpen} onClose={hideAuthModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyModal;
