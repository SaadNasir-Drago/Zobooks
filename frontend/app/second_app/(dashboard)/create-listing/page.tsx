"use client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { submitPropertyDetails } from "../../../../store/slices/propertySlice"; // Import the thunk

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/store"; // Import types from the store
import { Notyf } from "notyf";
import mapboxgl from "mapbox-gl"; // Import Mapbox
mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9obi1hc3RybyIsImEiOiJjbTJsYzU2aTgwYWIzMmpxeWc3dWV3NjE0In0.tOrWvAEGmI14B0uciQqbSQ";

import "mapbox-gl/dist/mapbox-gl.css";

const MediaUpload = dynamic(() => import("./imgUpload"), { ssr: false });
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import RentDetails from "./rentDetails";
import AmenitiesForm from "./amenitiesForm"; // Import the AmenitiesForm component
import ProtectedRoute from "@/components/ProtectedRoute";

interface FilePreview {
  name: string;
  preview: string;
}

const steps = ["Property Info", "Rent Details", "Media", "Amenities", "Review"];

interface AddressInputProps {
  setlat: (lat: number) => void;
  setlong: (lng: number) => void;
  setAddress: (address: string) => void; // New prop for setting address in the parent
  address: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  setlat,
  setlong,
  setAddress,
  address,
}) => {
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const [error, setError] = useState("");
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  const validateAddressFormat = (address: string) => {
    // Regular expression pattern to match "123 Main St #4B Springfield, IL 62702" format
    const addressPattern =
      /^\d+\s[A-Za-z0-9\s]+(?:\s(?:St|Ave|Blvd|Rd|Dr|Ln|Ct|Pl))?\s?(?:#\w+)?\s[A-Za-z\s]+,\s[A-Z]{2}\s\d{5}$/;
    return addressPattern.test(address);
  };

  // Function to validate address using USPS API
  const validateAddressWithUsps = async (address: string) => {
    try {
      // Use local format validation only
      if (!validateAddressFormat(address)) {
        throw new Error("Invalid address format");
      }
      setError(""); // Clear error if format is valid
      notyf.success("Address format is valid");
      return address; // Return address if valid
    } catch {
      notyf.error("Invalid address format, please check again.");
      setError("Invalid address format, please check again.");
      return null;
    }
  };

  // Function to get coordinates from a validated address using Mapbox Geocoding API
  const getCoordinatesFromAddress = async (address: string) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    return {
      lat: data.features[0].center[1],
      lng: data.features[0].center[0],
    };
  };

  // Debounce function to avoid excessive calls to USPS and Mapbox APIs
  const debounce = (func: (...args: unknown[]) => void, delay: number) => {
    let timerId: NodeJS.Timeout;
    return (...args: unknown[]) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced function to validate and update map location
  const handleAddressChange = useCallback(
    debounce(async (newAddress: string) => {
      try {
        setError(""); // Clear any previous errors
        const uspsValidatedAddress = await validateAddressWithUsps(newAddress);
        if (uspsValidatedAddress) {
          const { lat, lng } =
            await getCoordinatesFromAddress(uspsValidatedAddress);
          setlat(lat);
          setlong(lng);

          if (map) {
            map.flyTo({ center: [lng, lat], zoom: 14 });

            // If a marker exists, remove it before placing a new one
            if (marker) marker.remove();

            // Create a new marker and place it on the map
            const newMarker = new mapboxgl.Marker()
              .setLngLat([lng, lat])
              .addTo(map);

            // Set the new marker in state
            setMarker(newMarker);
          }
        }
      } catch {
        setError("Unable to validate address.");
      }
    }, 1000), // Adjust debounce delay as needed
    [map, marker] // Add marker to dependency array
  );

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-98.5795, 39.8283], // Default to US center
      zoom: 3,
    });
    setMap(mapInstance);
    setNotyf(new Notyf());
    return () => mapInstance.remove();
  }, []);

  return (
    <Box mt={3}>
      <Typography variant="h6">Address</Typography>
      <TextField
        label="Enter Address"
        fullWidth
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          handleAddressChange(e.target.value);
        }}
        error={!!error}
        helperText={error}
        variant="outlined"
        margin="normal"
      />
      <Box mt={2} height="400px" id="map" /> {/* Placeholder for Mapbox map */}
    </Box>
  );
};

const CreateListing: React.FC<any> = ({ updateData }) => {
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNotyf(
      new Notyf({
        duration: 1000,
        position: {
          x: "right",
          y: "top",
        },
      })
    );
    if (updateData) {
      setPropertyType(updateData.propertyType ?? "");
      setSquareFootage(updateData.size ?? "");
      setBedrooms(updateData.bed ?? "");
      setBathrooms(updateData.bath ?? "");
      setDescription(updateData.description ?? "");
      setAddress(updateData.address ?? "");
      setRent(updateData.price ?? "");
      setIsForRent(updateData.isForRent ?? true);
      setIsForSale(updateData.isForSale ?? false);
      setAmenities(updateData.amenities ?? []);
      setFiles(
        updateData.images?.map((image) => ({ name: image, preview: image })) ??
          []
      );
      setlat(updateData.lat ?? 0);
      setlong(updateData.long ?? 0);
    }
  }, [updateData]);

  const [propertyType, setPropertyType] = useState<string>(""); // New state for property type
  const [squareFootage, setSquareFootage] = useState<number | string>("");
  const [bedrooms, setBedrooms] = useState<number | string>("");
  const [bathrooms, setBathrooms] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [address, setAddress] = useState<string>(""); // State for address

  //details rent or sale
  const [listingType, setListingType] = useState<string>("rent");
  const [securityDeposit, setSecurityDeposit] = useState<number | string>("");
  const [rent, setRent] = useState<number | string>("");
  const [isForRent, setIsForRent] = useState(true);
  const [isForSale, setIsForSale] = useState(false);

  //mapbox
  const [lat, setlat] = useState<number | null>(null);
  const [long, setlong] = useState<number | null>(null);

  const router = useRouter();

  // Add this validation function
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        // Basic property details validation
        return !!(
          propertyType &&
          squareFootage &&
          bedrooms &&
          bathrooms &&
          address &&
          description
        );

      case 1:
        // Rent/Sale details validation
        if (isForRent) {
          return !!(rent && securityDeposit);
        }
        return true;

      case 2:
        // Media validation
        return files.length > 0;

      case 3:
        // Amenities validation
        return amenities.length > 0;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      router.push("/properties");
    } else if (isStepValid(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      alert("Please fill in all required fields before proceeding");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission (for demonstration)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const propertyData = {
      size: Number(squareFootage),
      bed: Number(bedrooms),
      bath: Number(bathrooms),
      description,
      amenities,
      lat,
      long,
      address,
      price: Number(rent),
      propertyType,
      isForRent,
      isForSale,
    };

    try {
      const result = await dispatch(submitPropertyDetails(propertyData));

      // Handle successful submission
      if (submitPropertyDetails.fulfilled.match(result)) {
        handleNext(); // Proceed to the next step after form submission
        notyf.success("Property submitted successfully");
      } else {
        // Handle errors if the submission failed
        console.error("Failed to submit property:", result.error.message);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
    }
  };

  // Function to jump to specific steps
  const handleEdit = (step: number) => {
    setActiveStep(step);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    event.preventDefault();
    const propertyData = {
      _id: updateData?._id,
      size: Number(squareFootage),
      bed: Number(bedrooms),
      bath: Number(bathrooms),
      description,
      amenities,
      lat,
      long,
      address,
      price: Number(rent),
      propertyType,
      isForRent,
      isForSale,
    };
    try {
      const response = await fetch(
        `https://zolo-production.up.railway.app/api/updateProperty/${propertyData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(propertyData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update property data");
      }

      const result = await response.json();
      notyf.success("Property updated successfully");
      router.push("/properties");
      return result;
    } catch (error) {
      notyf.error("Error updating property data");
      console.error("Error updating property data:", error);
      throw error;
    }
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Create Your Property Listing
          </Typography>

          <Box mt={2}>
            {/* Stepper */}
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <React.Fragment>
            <form onSubmit={handleSubmit}>
              {/* Render form based on the active step */}
              {activeStep === 0 && (
                <React.Fragment>
                  {/* Property Type Select */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={propertyType}
                      onChange={(e) =>
                        setPropertyType(e.target.value as string)
                      }
                      label="Property Type"
                      required
                    >
                      <MenuItem value="Apartment">Apartment</MenuItem>
                      <MenuItem value="House">House</MenuItem>
                      <MenuItem value="Condo">Condo</MenuItem>
                      <MenuItem value="Townhouse">Townhouse</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Square Footage Input */}
                  <TextField
                    label="Square Footage"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={squareFootage}
                    type="number"
                    onChange={(e) => setSquareFootage(e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                    required
                  />

                  {/* Bedrooms Select */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Total Bedrooms</InputLabel>
                    <Select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value as number)}
                      label="Total Bedrooms"
                      required
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5+</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Bathrooms Select */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Total Bathrooms</InputLabel>
                    <Select
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value as number)}
                      label="Total Bathrooms"
                      required
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4+</MenuItem>
                    </Select>
                  </FormControl>

                  <AddressInput
                    setlat={setlat}
                    setlong={setlong}
                    setAddress={setAddress}
                    address={address}
                  />

                  <Box mt={4}>
                    <Typography variant="h4" gutterBottom>
                      Description
                    </Typography>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Box>
                </React.Fragment>
              )}

              {activeStep === 1 && (
                <RentDetails
                  setIsForRent={setIsForRent}
                  setIsForSale={setIsForSale}
                  listingType={listingType}
                  setListingType={setListingType}
                  securityDeposit={securityDeposit}
                  setSecurityDeposit={setSecurityDeposit}
                  rent={rent}
                  setRent={setRent}
                />
              )}

              {/* Media Step */}
              {activeStep === 2 && (
                <MediaUpload files={files} setFiles={setFiles} />
              )}

              {activeStep === 3 && (
                <AmenitiesForm
                  amenities={amenities}
                  setAmenities={setAmenities}
                />
              )}

              {/* Review Step */}
              {activeStep === 4 && (
                <Box mt={4}>
                  <Typography variant="h5" gutterBottom>
                    Review Your Listing
                  </Typography>

                  {/* Property Information Card */}
                  <Card sx={{ mt: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Property Information</Typography>
                      <Typography>Property Type: {propertyType}</Typography>
                      <Typography>
                        Square Footage: {squareFootage} sq ft
                      </Typography>
                      <Typography>Bedrooms: {bedrooms}</Typography>
                      <Typography>Bathrooms: {bathrooms}</Typography>
                      <Typography>Address: {address}</Typography>
                      <Typography sx={{ mt: 2 }}>
                        Description: {description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(0)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>

                  {/* Rent/Sale Details Card */}
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Listing Details</Typography>
                      <Typography>
                        Listing Type: {isForRent ? "For Rent" : ""}{" "}
                        {isForSale ? "For Sale" : ""}
                      </Typography>
                      {isForRent && (
                        <>
                          <Typography>Monthly Rent: ${rent}</Typography>
                          <Typography>
                            Security Deposit: ${securityDeposit}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(1)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>

                  {/* Media Card */}
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Uploaded Media</Typography>
                      {files.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {files.map((file) => (
                            <Box key={file.name}>
                              <Typography variant="body2">
                                {file.name}
                              </Typography>
                              {file.preview && (
                                <img
                                  src={`/uploads/${file.name}`}
                                  alt={file.name}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    marginTop: "8px",
                                  }}
                                />
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography>No media uploaded</Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(2)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>

                  {/* Amenities Card */}
                  <Card sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Amenities</Typography>
                      {amenities.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {amenities.map((amenity) => (
                            <Typography
                              key={amenity}
                              variant="body2"
                              sx={{
                                bgcolor: "primary.light",
                                color: "white",
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              {amenity}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography>No amenities selected</Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(3)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              )}

              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateData ? handleUpdate : handleSubmit} // Call handleUpdate or handleSubmit based on updateData
                  >
                    {updateData ? "Update" : "Publish"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext} // Move to the next step
                    type="button"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </React.Fragment>
        </Box>
      </Container>
    </ProtectedRoute>
  );
};

export default CreateListing;
