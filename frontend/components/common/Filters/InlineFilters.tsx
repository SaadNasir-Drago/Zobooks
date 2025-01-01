"use client";
import React from "react";

interface InlineFiltersProps {
  onPriceChange: (order: "asc" | "desc") => void;
  onRecencyChange: (order: "newest" | "oldest") => void;
  onTypeChange: (type: string) => void;
  selectedPrice: "asc" | "desc";
  selectedRecency: "newest" | "oldest";
  selectedType: string;
}

const InlineFilters: React.FC<InlineFiltersProps> = ({
  onPriceChange,
  onRecencyChange,
  onTypeChange,
  selectedPrice,
  selectedRecency,
  selectedType,
}) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Price Filter */}
      <select
        className="border rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
        value={selectedPrice}
        onChange={(e) => onPriceChange(e.target.value as "asc" | "desc")}
      >
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

      {/* Recency Filter */}
      <select
        className="border rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
        value={selectedRecency}
        onChange={(e) => onRecencyChange(e.target.value as "newest" | "oldest")}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {/* Property Type Filter */}
      <select
        className="border rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="all">All Property Types</option>
        <option value="Apartment">Apartment</option>
        <option value="Townhouse">Townhouse</option>
        <option value="House">House</option>
        <option value="Villa">Villa</option>
        <option value="Duplex">Duplex</option>
        <option value="Condo">Condo</option>
        <option value="Studio">Studio</option>
      </select>
    </div>
  );
};

export default InlineFilters;
