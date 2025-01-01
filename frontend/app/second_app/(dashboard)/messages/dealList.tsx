"use client"
import React from "react";
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Paper, 
  Avatar, 
  Typography,
  Box
} from "@mui/material";
import { Deal } from "@/types/types";

interface DealListProps {
  dealLogs: Deal[];
  selectedDeal: Deal | null;
  onSelectDeal: (deal: Deal) => void;
}

const DealList: React.FC<DealListProps> = ({ dealLogs, selectedDeal, onSelectDeal }) => {
  // Function to get initials from name
  const getInitials = (user: { firstname: string; lastname: string; email: string }) => {
    const { firstname, lastname } = user;
    const initials = `${firstname[0]}${lastname[0]}`;
    return initials.toUpperCase();
  };

  // Function to truncate address
  const truncateAddress = (address: string, maxLength: number = 30) => {
    if (!address) return 'No address available';
    return address.length > maxLength
      ? `${address.substring(0, maxLength)}...`
      : address;
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return '#4caf50'; // green
      case 'rejected':
        return '#f44336'; // red
      case 'ongoing':
        return '#ff9800'; // orange
      default:
        return '#757575'; // grey
    }
  };

  return (
    <Paper
      sx={{
        height: "100%",
        overflow: "auto",
        borderRadius: 3,
        boxShadow: 4,
        backgroundColor: "#ffffff",
      }}
    >
      <List sx={{width:'auto', position:"relative"}}>
        {dealLogs.map((deal) => (
          <ListItem
            key={deal._id}
            onClick={() => onSelectDeal(deal)}
            sx={{
              cursor: "pointer",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: selectedDeal?._id === deal._id ? "#e3f2fd" : "transparent",
              "&:hover": {
                backgroundColor: "#f0f4f8",
                transition: "background-color 0.3s ease",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar 
                sx={{ 
                  bgcolor: '#3f51b5',
                  width: 40,
                  height: 40,
                  fontSize: '1rem'
                }}
              >
                {getInitials(deal.otherUser)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {deal.otherUser.firstname} {deal.otherUser.lastname}
                  </Typography> */}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      backgroundColor: getStatusColor(deal.status),
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      textTransform: 'capitalize'
                    }}
                  >
                    {deal.status}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ 
                    mt: 0.5,
                    fontSize: '0.875rem',
                    color: 'text.secondary'
                  }}
                >
                  {truncateAddress(deal.propertyAddress)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DealList;