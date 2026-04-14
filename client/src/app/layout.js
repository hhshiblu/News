import "./globals.css";

export const metadata = {
  title: {
    default: "LabourPulse — Bangladesh's Labour & Economy News Portal",
    template: "%s | LabourPulse",
  },
  description:
    "LabourPulse is Bangladesh's leading news portal covering labour rights, economy, politics, and international affairs with in-depth reporting and analysis.",
  keywords: ["Bangladesh news", "labour rights", "economy", "politics", "RMG", "garment workers"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
