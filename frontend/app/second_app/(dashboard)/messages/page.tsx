"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import { Deal, Message, Property } from "@/types/types";
import dynamic from "next/dynamic";

const OfferDialog = dynamic(() => import("./makeOfferDialog"));
const AcceptDeclineDialog = dynamic(() => import("./acceptDeclineDialog"));
const DealList = dynamic(() => import("./dealList"));
const PropertyModal = dynamic(() => import("./detailsModal"));
import { io } from "socket.io-client";
import { Notyf } from "notyf";

const socket = io("https://zolo-production.up.railway.app"); // Connect to the WebSocket server

const MessageThread = () => {
  const [isClient, setIsClient] = useState(false);
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const userCookie = Cookies.get("user");
  const userData = userCookie
    ? JSON.parse(decodeURIComponent(userCookie))
    : null;

  const [dealLogs, setDealLogs] = useState<Deal[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property>();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [openAcceptDeclineDialog, setOpenAcceptDeclineDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Message | null>(null);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch initial data and select first deal
  useEffect(() => {
    setIsClient(true); // Ensure rendering only happens on the client
    const initializeData = async () => {
      const deals = await fetchDealLogs();
      if (deals.length > 0) {
        await handleSelectDeal(deals[0]);
      }
    };

    initializeData();
    setNotyf(new Notyf());
  }, []);

  // Initialize socket connection
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  // Set up message listener when selected deal changes
  useEffect(() => {
    if (!selectedDeal) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.dealId === selectedDeal._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    // Remove any existing message listeners before adding new one
    socket.off("newMessage");
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedDeal]);

  const fetchDealLogs = async () => {
    try {
      const token = Cookies.get("token");
      const page = 1;
      const limit = 10;
      const response = await fetch(
        `https://zolo-production.up.railway.app/api/deals?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.length === 0) {
        notyf.error("No deals found for the user");
      } else {
        // notyf.success("Deals fetched successfully");
      }

      setDealLogs(data.deals);
      return data.deals;
    } catch (error) {
      console.error("Error fetching deal logs:", error);
      notyf.error("Error fetching deal logs");
      return [];
    }
  };

  const fetchPropertyDetails = async (dealId: string) => {
    try {
      const response = await fetch(
        `https://zolo-production.up.railway.app/api/dealProperty?dealId=${dealId}`
      );
      const data = await response.json();
      return data.property; // Assuming the API response has a 'property' field
    } catch (error) {
      console.error("Error fetching property details:", error);
      return null;
    }
  };

  const fetchMessages = async (dealId: string) => {
    try {
      const response = await fetch(
        `https://zolo-production.up.railway.app/api/message?dealId=${dealId}`
      );
      const data = await response.json();
      if (data.messages) {
        return data.messages;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  const handleSelectDeal = async (deal: Deal) => {
    setSelectedDeal(deal);
    setIsChatClosed(deal.status === "accepted" || deal.status === "rejected");

    // Fetch property details and messages for the selected deal
    const [property, dealMessages] = await Promise.all([
      fetchPropertyDetails(deal._id),
      fetchMessages(deal._id),
    ]);

    setSelectedProperty(property);
    setMessages(dealMessages);
  };

  const sendMessage = async (isOffer: boolean) => {
    if (
      !newMessage.trim() ||
      !selectedDeal ||
      !selectedProperty ||
      isChatClosed
    )
      return;

    const newMessageData = {
      dealId: selectedDeal._id,
      content: isOffer ? `$${parseInt(newMessage, 10)}` : newMessage,
      offer: isOffer,
      ...(userData?._id === selectedDeal.buyerId
        ? { buyerId: userData?._id }
        : { sellerId: userData?._id }),
    };

    try {
      const response = await fetch(
        "https://zolo-production.up.railway.app/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessageData),
        }
      );

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages([...messages, savedMessage.savedMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendOffer = async () => {
    await sendMessage(true);
    setOpenOfferDialog(false);
  };

  const handleOfferClick = (offer: Message) => {
    if (offer.buyerId !== userData.buyerId) {
      setSelectedOffer(offer);
      setOpenAcceptDeclineDialog(true);
    }
  };

  const handleAcceptOffer = async () => {
    if (!selectedDeal || !selectedOffer) return;
    try {
      await fetch(
        `https://zolo-production.up.railway.app/api/acceptDeal?dealId=${selectedDeal._id}`,
        {
          method: "PUT",
        }
      );

      const notificationMessage = {
        content:
          "This property has been sold to another buyer. This chat is now closed.",
        sellerId: selectedDeal.sellerId,
        offer: false,
        dealId: selectedDeal._id,
        propertyId: selectedDeal.propertyId,
      };

      await fetch("https://zolo-production.up.railway.app/api/messageAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationMessage),
      });

      const newMessageData = {
        dealId: selectedDeal._id,
        content: "This Offer has been accepted. This chat is now closed",
        offer: false,
        ...(userData?._id === selectedDeal.buyerId
          ? { buyerId: userData?._id }
          : { sellerId: userData?._id }),
      };

      const response = await fetch(
        "https://zolo-production.up.railway.app/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessageData),
        }
      );

      if (response.ok) {
        setIsChatClosed(true);
        const savedMessage = await response.json();
        setMessages([...messages, savedMessage.savedMessage]);
        setOpenAcceptDeclineDialog(false);
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
    }
  };

  const handleDeclineOffer = async () => {
    if (!selectedDeal || !selectedOffer) return;

    try {
      const notificationMessage = {
        content: "The offer has been declined.",
        propertyId: selectedProperty?._id || "",
        dealId: selectedDeal._id,
        offer: false,
        ...(userData?._id === selectedDeal.buyerId
          ? { buyerId: userData?._id }
          : { sellerId: userData?._id }),
      };

      const response = await fetch(
        "https://zolo-production.up.railway.app/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationMessage),
        }
      );

      if (response.ok) {
        const savedMessage = await response.json();
        setMessages([...messages, savedMessage.savedMessage]);
      }
      setIsChatClosed(true);
      setOpenAcceptDeclineDialog(false);
    } catch (error) {
      console.error("Error declining offer:", error);
    }
  };

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", p: 2, backgroundColor: "#fffff" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Deal List Column */}
        <Grid item xs={3}>
          <DealList
            dealLogs={dealLogs}
            selectedDeal={selectedDeal}
            onSelectDeal={handleSelectDeal}
          />
        </Grid>

        {/* Chat Column */}
        <Grid item xs={9}>
          <Paper
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: 4,
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Property Info Section */}
            {selectedProperty && (
              <Box
                onClick={openModal} // Set click event to open modal
                sx={{
                  p: 2,
                  backgroundColor: "#f5f7fa",
                  borderBottom: "1px solid #e0e0e0",
                  cursor: "pointer", // Indicates it's clickable
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                {/* Text Section */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ textAlign: "left", mb: 1 }}
                  >
                    {selectedProperty.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "left", mb: 1 }}
                  >
                    ${selectedProperty?.price.toLocaleString()}
                  </Typography>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      Type: {selectedProperty.propertyType}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      Size: {selectedProperty.size} sq ft
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      Beds: {selectedProperty.bed} | Baths:{" "}
                      {selectedProperty.bath}
                    </Typography>
                  </Box>
                </Box>

                {/* Image Section */}
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    overflow: "hidden",
                    borderRadius: 2,
                    ml: "auto", // Pushes image to the top-right
                  }}
                >
                  <img
                    src={`/uploads/${selectedProperty?.images[0]}`}
                    alt="Property"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Property Modal */}
            <PropertyModal
              property={selectedProperty}
              isOpen={isModalOpen}
              onClose={closeModal}
            />

            {/* Messages Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 3,
                backgroundColor: "#fbfbfc",
              }}
            >
              {messages.map((message) => {
                const isCurrentUser =
                  userData?._id === message.sellerId ||
                  userData?._id === message.buyerId;

                return (
                  <Box
                    key={message._id}
                    sx={{
                      display: "flex",
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Paper
                      onClick={() =>
                        message.offer &&
                        message.buyerId !== userData?._id &&
                        !isChatClosed &&
                        handleOfferClick(message)
                      }
                      sx={{
                        p: 2,
                        maxWidth: "60%",
                        borderRadius: 2,
                        background: message.offer
                          ? "linear-gradient(135deg, #f8d390, #f9b853)" // Special background for offers
                          : isCurrentUser
                            ? "#dbeffd" // Background color for current user's messages
                            : "#e9e9e9", // Background color for other user's messages
                        cursor:
                          message.offer && message.sellerId === userData?._id
                            ? "pointer"
                            : "default",
                      }}
                    >
                      <Typography>{message.content}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.createdAt!).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Box>
                );
              })}
            </Box>

            {/* Message Input */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: isChatClosed
                  ? "rgba(255, 255, 255, 0.7)"
                  : "white",
                display: "flex",
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder={isChatClosed ? "Chat closed" : "Type a message..."}
                disabled={isChatClosed}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isChatClosed) {
                    sendMessage(false);
                  }
                }}
              />
              {userData?._id !== selectedDeal?.sellerId && (
                <IconButton
                  color="primary"
                  onClick={() => setOpenOfferDialog(true)}
                  disabled={isChatClosed}
                >
                  <MoneyIcon />
                </IconButton>
              )}
              <IconButton
                color="primary"
                onClick={() => sendMessage(false)}
                disabled={isChatClosed}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Offer Dialog */}
      <OfferDialog
        open={openOfferDialog}
        onClose={() => setOpenOfferDialog(false)}
        onSendOffer={sendOffer}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />

      {/* Accept/Decline Dialog */}
      <AcceptDeclineDialog
        open={openAcceptDeclineDialog}
        onClose={() => setOpenAcceptDeclineDialog(false)}
        selectedOffer={selectedOffer}
        handleAcceptOffer={handleAcceptOffer}
        handleDeclineOffer={handleDeclineOffer}
      />
    </Box>
  );
};

export default MessageThread;
