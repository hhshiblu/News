import Navbar from "@/components/layout/Navbar";
import BreakingNewsTicker from "@/components/layout/BreakingNewsTicker";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import HomeTopAd from "@/components/layout/HomeTopAd";
import { getCategories } from "@/actions/public";
import { mapPublicNavCategories } from "@/lib/mapPublicNavCategories";

export const metadata = {
  title: {
    default: "LabourPulse",
    template: "%s | LabourPulse",
  },
  description:
    "Latest labour, economy, politics, and international news with in-depth reporting.",
};

export default async function PublicLayout({ children }) {
  const categoriesRes = await getCategories();
  const navCategories = mapPublicNavCategories(categoriesRes?.data);

  return (
    <>
      <HomeTopAd />
      <Navbar navCategories={navCategories} />

      {/* Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* Page Content */}
      <main className="w-full">{children}</main>

      {/* Footer */}
      <Footer navigationCategories={navCategories} />

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
