"use client";

import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation"; // for redirecting users
import Cookies from "js-cookie";
import { PropertyCard } from "@/components/common/Card/PropertyCard";

// Define the type for a Property
interface Property {
  _id: string;
  address: string;
  description: string;
  isForRent: boolean;
  isForSale: boolean;
}

// Component Definition
export default function Page() {
  const [filter, setFilter] = useState<"All" | "Rent" | "For Sale">("All"); // To manage selected tab
  const [searchQuery] = useState(""); // To manage search input
  const [properties, setProperties] = useState<Property[]>([]); // To store the properties fetched from the API
  const [loading, setLoading] = useState(true); // To manage loading state
  const router = useRouter();

  // Fetch properties created by the logged-in user
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://zolo-production.up.railway.app/api/user-properties",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the response was successful
        if (response.ok) {
          const data: Property[] = await response.json();
          if (data.length === 0) {
            setProperties([]);
            
          } else {
            setProperties(data);
          }
        } else {
          
        }
      } catch (err) {
        console.error("Network Error:", err);
       
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Fetch when component mounts

  // Function to handle the filtering of properties
  const filteredProperties = properties.filter((property: Property) => {
    const matchesCategory =
      filter === "All" || (property.isForRent ? "Rent" : "For Sale") === filter;
    const matchesSearch =
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle redirect to create listing page
  const handleCreateListing = () => {
    router.push("/second_app/create-listing");
  };

  // Function to handle property deletion and update the state
  const handleDeleteProperty = (deletedPropertyId: string) => {
    setProperties((prevProperties) =>
      prevProperties.filter(
        (property: Property) => property._id !== deletedPropertyId
      )
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Navigation Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          border: "1px black groove",
        }}
      >
        <Tabs
          value={filter}
          onChange={(e, newValue: "All" | "Rent" | "For Sale") =>
            setFilter(newValue)
          }
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="All" value="All" />
          <Tab label="Rent" value="Rent" />
          <Tab label="For Sale" value="For Sale" />
        </Tabs>
      </Box>

      {/* Property Cards or Message */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 1.5,
        }}
      >
        {loading ? (
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property: Property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onDelete={handleDeleteProperty} // Pass the delete handler to the PropertyCard
            />
          ))
        ) : (
          <>
            <div className="h-[30vh]"></div>
            <div></div>
            <div></div>
            <div></div>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No properties found.
              </Typography>
              {/* Show button to create a property */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateListing}
                sx={{ mt: 2 }}
              >
                Create a New Listing
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
