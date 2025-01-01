"use client";
import localFont from "next/font/local";
import "./globals.css";
import { SortProvider } from "@/context/sortContext";
import { SearchProvider } from "@/context/searchContext";
import { GenreProvider } from "@/context/genreContext";
import { BookProvider, SelectedBookProvider } from "@/context/bookContext";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SortProvider>
          <SearchProvider>
            <GenreProvider>
              <BookProvider>
                <SelectedBookProvider>
                  {children}
                  <Toaster />
                </SelectedBookProvider>
              </BookProvider>
            </GenreProvider>
          </SearchProvider>
        </SortProvider>
      </body>
    </html>
  );
}
