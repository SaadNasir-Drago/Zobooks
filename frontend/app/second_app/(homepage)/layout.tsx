"use client"
import { ReactNode } from "react";

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
