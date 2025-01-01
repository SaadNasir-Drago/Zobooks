import React from "react";
import {
  Typography,
  TextField,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface RentDetailsProps {
  listingType: string;
  setListingType: React.Dispatch<React.SetStateAction<string>>;
  securityDeposit: number | string;
  setSecurityDeposit: React.Dispatch<React.SetStateAction<number | string>>;
  rent: number | string;
  setRent: React.Dispatch<React.SetStateAction<number | string>>;
  setIsForRent: React.Dispatch<React.SetStateAction<boolean>>;
  setIsForSale: React.Dispatch<React.SetStateAction<boolean>>;
}

const RentDetails: React.FC<RentDetailsProps> = ({
  listingType,
  setListingType,
  securityDeposit,
  setSecurityDeposit,
  rent,
  setRent,
  setIsForRent,
  setIsForSale,
}) => {
  
  
  
  const handleListingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setListingType(value);

    if (value === "rent") {
      setIsForRent(true);
      setIsForSale(false);
    } else if (value === "sale") {
      setIsForRent(false);
      setIsForSale(true);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {listingType === "rent" ? "Rental Details" : "Sale Details"}
      </Typography>

      <FormControl component="fieldset" margin="normal">
        <RadioGroup
          row
          value={listingType}
          onChange={handleListingTypeChange}
        >
          <FormControlLabel
            value="rent"
            control={<Radio />}
            label="For Rent"
            required
          />
          <FormControlLabel
            value="sale"
            control={<Radio />}
            label="For Sale"
            required
          />
        </RadioGroup>
      </FormControl>

      <TextField
        label={listingType === "rent" ? "Monthly Rent" : "Sale Price"}
        variant="outlined"
        fullWidth
        margin="normal"
        value={rent}
        onChange={(e) => setRent(e.target.value)}
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
        required
      />

      <TextField
        label={listingType === "rent" ? "Security Deposit" : "Down Payment"}
        variant="outlined"
        fullWidth
        margin="normal"
        value={securityDeposit}
        onChange={(e) => setSecurityDeposit(e.target.value)}
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
        required
      />
    </Box>
  );
};

export default RentDetails;
