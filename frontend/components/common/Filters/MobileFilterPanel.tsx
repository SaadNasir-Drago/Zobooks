// import React from "react";
// import { SlidersHorizontal } from "lucide-react";

// interface FilterOptions {
//   minPrice: number;
//   maxPrice: number;
//   beds: number;
//   baths: number;
//   propertyType: string;
//   sortBy: "price_asc" | "price_desc" | "date_new" | "date_old";
// }

// interface MobileFilterPanelProps {
//   filters: FilterOptions;
//   onFilterChange: (filters: FilterOptions) => void;
//   showFilters: boolean;
//   onToggleFilters: () => void;
// }

// const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({
//   filters,
//   onFilterChange,
//   showFilters,
//   onToggleFilters,
// }) => {
//   return (
//     <div className="md:hidden">
//       <button
//         className={`p-2 rounded-full ${showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
//         onClick={onToggleFilters}
//       >
//         <SlidersHorizontal className="w-5 h-5" />
//       </button>

//       {showFilters && (
//         <div className="absolute left-0 right-0 top-full bg-white shadow-lg border-t z-50">
//           <div className="p-4 space-y-4">
//             {/* Beds */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Beds
//               </label>
//               <select
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={filters.beds}
//                 onChange={(e) =>
//                   onFilterChange({
//                     ...filters,
//                     beds: Number(e.target.value),
//                   })
//                 }
//               >
//                 <option value={0}>Any</option>
//                 <option value={1}>1+</option>
//                 <option value={2}>2+</option>
//                 <option value={3}>3+</option>
//                 <option value={4}>4+</option>
//               </select>
//             </div>

//             {/* Baths */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Baths
//               </label>
//               <select
//                 className="w-full border rounded-lg px-3 py-2"
//                 value={filters.baths}
//                 onChange={(e) =>
//                   onFilterChange({
//                     ...filters,
//                     baths: Number(e.target.value),
//                   })
//                 }
//               >
//                 <option value={0}>Any</option>
//                 <option value={1}>1+</option>
//                 <option value={2}>2+</option>
//                 <option value={3}>3+</option>
//                 <option value={4}>4+</option>
//               </select>
//             </div>

//             {/* Price Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Price Range
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   className="border rounded-lg px-3 py-2"
//                   value={filters.minPrice}
//                   onChange={(e) =>
//                     onFilterChange({
//                       ...filters,
//                       minPrice: Number(e.target.value),
//                     })
//                   }
//                 />
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   className="border rounded-lg px-3 py-2"
//                   value={filters.maxPrice}
//                   onChange={(e) =>
//                     onFilterChange({
//                       ...filters,
//                       maxPrice: Number(e.target.value),
//                     })
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileFilterPanel;

import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  beds: number;
  baths: number;
}

interface MobileFilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
}) => {
  return (
    <>
      <button
        className={`p-2 rounded-full ${showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
        onClick={onToggleFilters}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      {showFilters && (
        <div className="absolute left-0 right-0 top-full bg-white shadow-lg border-t z-50 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg px-3 py-2"
                  value={filters.minPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      minPrice: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg px-3 py-2"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      maxPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beds
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={filters.beds}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    beds: Number(e.target.value),
                  })
                }
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Baths
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={filters.baths}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    baths: Number(e.target.value),
                  })
                }
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterPanel;
