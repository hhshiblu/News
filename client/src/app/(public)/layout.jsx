import Navbar from "@/components/layout/Navbar";
import BreakingNewsTicker from "@/components/layout/BreakingNewsTicker";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import HomeTopAd from "@/components/layout/HomeTopAd";

export const metadata = {
  title: {
    default: "LabourPulse",
    template: "%s | LabourPulse",
  },
  description:
    "Latest labour, economy, politics, and international news with in-depth reporting.",
};

export default function PublicLayout({ children }) {
  return (
    <>
      <HomeTopAd />
      <Navbar />

      {/* Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* Page Content */}
      <main className="w-full min-h-[calc(100dvh-18rem)]">{children}</main>

      {/* Footer */}
      <Footer />

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
