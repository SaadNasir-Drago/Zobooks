"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppProvider } from "@toolpad/core";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../../components/layouts/Header/page";
import { AuthProvider } from "./auth/AuthContext";
import { Suspense } from "react";

// Font definitions
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isBaseUrl = ["/second_app/properties", "/second_app/messages", "/second_app/create-listing"].includes(
    pathname
  );

  return (
    // <html lang="en">
      // <body
      //   className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // >
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <AppProvider>
              <AuthProvider>
                {!isBaseUrl && <Header />}
                {/* Conditionally render the Header based on the path */}
                {children}
              </AuthProvider>
            </AppProvider>
          </AppRouterCacheProvider>
        </Suspense>
      // </body>
    // </html>
  );
}
