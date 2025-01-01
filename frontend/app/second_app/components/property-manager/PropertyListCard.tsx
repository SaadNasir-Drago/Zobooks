'use client'
import * as React from 'react';
import { Card, CardContent, CardMedia, Typography, Box , CardActions, Button} from '@mui/material';
import { styled } from '@mui/material/styles';

interface PropertyCardProps {
  title: string;
  description: string;
  image: string;
  tag: string;
}

export const StyledCard = styled(Card)({
  maxWidth: 345,
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', // Increase shadow on hover
  },
});

export const handleListingDelete = ()=>{
    
}

export default function PropertyListCard({ title, description, image, tag }: PropertyCardProps) {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        sx={{height:200}}
        image={image} // Property image from props
        alt={title}
      />
      <CardContent sx ={{display: ''}}>
        <Typography variant="h6" component="div">
          {title} {/* Title from props */}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {description} {/* Description from props */}
        </Typography>
        <Box sx={{ display: 'inline-block', bgcolor: 'grey', p: 0.5, borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: 'primary.contrastText' }}>
            {tag} {/* Tag from props */}
          </Typography>
        </Box>
      </CardContent>
<CardActions>
        <Button size="small" sx={{color:'red'}} onClick={handleListingDelete}>
          Delete
        </Button>
      </CardActions>
    </StyledCard>
  );
}
