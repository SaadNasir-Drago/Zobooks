"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { AppProvider } from "@toolpad/core";
import { HomeWorkSharp } from "@mui/icons-material";
import ChatBubbleOutlineSharpIcon from "@mui/icons-material/ChatBubbleOutlineSharp";
import { createTheme } from "@mui/material/styles";
import { Provider } from "react-redux";
import { store } from "../../../store/store";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AuthModal from "@/components/common/Modal/AuthModal";
import Button from "@/components/common/Button/page";
import Cookies from "js-cookie";
import axios from "axios";
// @ts-ignore
// Authentication component that will be part of the branding
const AuthButton: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setLoggedIn(!!Cookies.get("token"));
  }, []);

  const handleSignOut = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    delete axios.defaults.headers.common["Authorization"];
    setLoggedIn(false);
  };

  const handleAuthClick = () => {
    if (loggedIn) {
      handleSignOut();
    } else {
      setShowAuthModal(true);
    }
  };

  if (loggedIn === null) {
    return null;
  }

  return (
    <>
      <Button
        variant={loggedIn ? "secondary" : "primary"}
        onClick={handleAuthClick}
        className={loggedIn ? "text-white bg-red-600 border-red-600" : ""}
      >
        {loggedIn ? "Sign Out" : "Sign In"}
      </Button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setLoggedIn(!!Cookies.get("token"));
        }}
      />
    </>
  );
};

export const NAVIGATION = [
  {
    segment: "second_app/properties",
    title: "Properties",
    icon: <HomeWorkSharp />,
  },
  {
    segment: "second_app/messages",
    title: "Messages",
    icon: <ChatBubbleOutlineSharpIcon />,
  },
  {
    segment: "second_app/create-listing",
    title: "Create listing",
    icon: <ListAltIcon />,
  },
];


export const BRANDING = {
  logo: (
    <div className="flex items-center justify-between w-full gap-10">
      <img
        src="/uploads/Logo/zolo-high-resolution-logo-transparent.png"
        alt="logo"
        className="h-12"
      />
    </div>
  ),
  title: "",
  topRight: <AuthButton />,
};

export const customTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F9F9FE",
          paper: "#EEEEF9",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});



export default function DashboardPagesLayout(props: any) {
  const { children } = props;

  useEffect(() => {
    document.documentElement.setAttribute("data-toolpad-color-scheme", "light");
  }, []);

  return (
    <AppRouterCacheProvider>
      <Provider store={store}>
        <AppProvider
          navigation={(NAVIGATION as any)}
          branding={BRANDING}
          theme={customTheme}
        >
          <DashboardLayout
            defaultSidebarCollapsed={true}
            sx={{
              "& .MuiDrawer-paper": {
                width: 200,
                transition: "width 0.2s ease",
              },
              "& .MuiToolbar-root": {
                height: 70,
              },
              "& .MuiContainer-root": {
                maxWidth: "1400px",
                padding: "5px",
              },
            }}
          >
            <PageContainer>{children}</PageContainer>
          </DashboardLayout>
        </AppProvider>
      </Provider>
    </AppRouterCacheProvider>
  );
}