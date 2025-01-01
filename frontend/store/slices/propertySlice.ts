import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store"; // Import RootState if you have a typed store

// Helper function to retrieve the token from cookies
const getTokenFromCookies = () => {
  const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
  return match ? match[2] : null;
};

// Define the API URL
const API_URL = "https://zolo-production.up.railway.app/api/property";

// Define the Property state type
interface PropertyState {
  id?: number | null;
  userId?: number | null;
  address?: string;
  price?: number;
  bath: number;
  bed?: number;
  size?: number | string;
  description?: string;
  images?: string[];
  propertyType?: string;
  lat?: number | null;
  long?: number | null;
  isForRent?: boolean;
  isForSale?: boolean;
  amenities?: string[];
  listingStatus?: boolean;
  loading?: boolean; // For API call status
  error?: string | null; // For API error messages
}

// Initial state for the property
const initialState: PropertyState = {
  id: null,
  userId: null,
  address: "",
  price: 0,
  bath: 0,
  bed: 0,
  size: 0,
  description: "",
  images: [],
  propertyType: "",
  lat: null,
  long: null,
  isForRent: false,
  isForSale: false,
  amenities: [],
  listingStatus: false,
  loading: false,
  error: null,
};

// Define the async thunk for creating/updating a property
export const submitPropertyDetails = createAsyncThunk<
  PropertyState, // Returned data type
  PropertyState, // Thunk argument type
  { rejectValue: string } // Rejection value type
>(
  "property/submitPropertyDetails",
  async (property, { getState, rejectWithValue }) => {
    try {
      // Access the current images from the state
      const state = getState() as RootState;
      const currentImages = state.property.images;

      // Append the current images to the property object
      const propertyWithImages = {
        ...property,
        images: [...(property.images ?? []), ...(currentImages ?? [])],
      };

      const token = getTokenFromCookies(); // Retrieve the token from cookies
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyWithImages),
      });

      if (!response.ok) {
        throw new Error("Failed to submit property details");
      }

      return await response.json(); // Assuming the backend returns the created/updated property
    } catch {
      return rejectWithValue("An error occurred");
    }
  }
);

// Redux slice for the property
const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    // Action to set all property details
    setPropertyDetails: (
      state,
      action: PayloadAction<Partial<PropertyState>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    // Action to set images in the property state
    setPropertyImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state for API submission
      .addCase(submitPropertyDetails.pending, (state: PropertyState) => {
        state.loading = true;
        state.error = null;
      })
      // Success state for API submission
      .addCase(
        submitPropertyDetails.fulfilled,
        (state: PropertyState, action: PayloadAction<PropertyState>) => {
          state.loading = false;
          // Assuming the response contains the updated property details
          Object.assign(state, action.payload);
        }
      )
      // Error state for API submission
      .addCase(
        submitPropertyDetails.rejected,
        (state: PropertyState, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "An unknown error occurred.";
        }
      );
  },
});

// Export the actions
export const { setPropertyDetails, setPropertyImages } = propertySlice.actions;

// Export the reducer to be used in the store
export default propertySlice.reducer;
