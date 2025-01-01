import {
  Container,
  Typography,
  FormControl,
  Box,
  FormControlLabel,
  Grid,
  Checkbox,
  FormLabel,
  Divider,
} from "@mui/material";


interface AmenitiesFormProps {
  amenities: string[];
  setAmenities: (amenities: string[]) => void;
}

const AmenitiesForm: React.FC<AmenitiesFormProps> = ({ amenities, setAmenities }) => {

  const handleCheckboxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAmenities = event.target.checked
      ? [...amenities, name]
      : amenities.filter((amenity) => amenity !== name);
    setAmenities(updatedAmenities);
  };


  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4} p={3} bgcolor="background.paper" boxShadow={3} borderRadius={2}>
        <Typography variant="h5" gutterBottom>
          Showcase what&apos;s included in your home
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Sharing more will help customers see themselves in your home.
        </Typography>
        <Divider sx={{ width: '100%', margin: '20px 0' }} />
        <Grid container spacing={3}>

          

          {/* Appliances Section */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Appliances</FormLabel>
              {["dishwasher", "freezer", "microwave", "oven", "refrigerator", "laundry"].map((name, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={amenities.includes(name)}
                      onChange={handleCheckboxChange(name)}
                    />
                  }
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                />
              ))}
            </FormControl>
          </Grid>

          {/* Cooling Section */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Cooling</FormLabel>
              {["central", "wall", "window"].map((name, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={amenities.includes(name)}
                      onChange={handleCheckboxChange(name)}
                    />
                  }
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                />
              ))}
            </FormControl>
          </Grid>

          {/* Heating Section */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Heating</FormLabel>
              {["baseboard", "forcedAir", "heatPump"].map((name, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={amenities.includes(name)}
                      onChange={handleCheckboxChange(name)}
                    />
                  }
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                />
              ))}
            </FormControl>
          </Grid>

          {/* Flooring Section */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Flooring</FormLabel>
              {["carpet", "hardwood", "tile"].map((name, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={amenities.includes(name)}
                      onChange={handleCheckboxChange(name)}
                    />
                  }
                  label={name.charAt(0).toUpperCase() + name.slice(1)}
                />
              ))}
            </FormControl>
          </Grid>

          {/* Other Amenities */}
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Other Amenities</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={amenities.includes("furnished")}
                    onChange={handleCheckboxChange("furnished")}
                  />
                }
                label="Furnished"
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AmenitiesForm;
