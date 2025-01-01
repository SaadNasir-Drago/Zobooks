import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search by address or zipcode..."
      className="pl-8 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
    <Search className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" />
    {searchTerm && (
      <button onClick={() => onSearch("")} className="absolute right-2 top-2.5">
        <X className="w-5 h-5 text-gray-400" />
      </button>
    )}
  </div>
);

export default SearchBar;
