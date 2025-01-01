"use client";

import dynamic from "next/dynamic";

const Hero = dynamic(() => import("../../../components/sections/Hero/page"), {
  ssr: false,
});
const Recommendations = dynamic(
  () => import("../../../components/sections/Recommendations/page"),
  { ssr: false }
);
const Features = dynamic(
  () => import("../../../components/sections/Features/page"),
  { ssr: false }
);
const Footer = dynamic(
  () => import("../../../components/layouts/Footer/page"),
  { ssr: false }
);

export default function Homepage() {
  return (
    <>
      <Hero />
      <Recommendations />
      <Features />
      <Footer />
    </>
  );
}
