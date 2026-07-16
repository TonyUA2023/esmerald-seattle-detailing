import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-main" });

export const metadata: Metadata = {
  title: "Premium Mobile Car Detailing in Seattle | Emerald Mobile Detailing",
  description: "Top-rated mobile auto detailing near you in Seattle, Bellevue, Redmond, and Kirkland. We restore your vehicle's shine at your home or office.",
  openGraph: {
    title: "Premium Mobile Car Detailing in Seattle",
    description: "Top-rated mobile auto detailing near you in Seattle. We restore your vehicle's shine at your home or office.",
    url: "https://esmeraldseattledetail.com",
    siteName: "Emerald Mobile Detailing",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema markup injection
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "name": "Emerald Mobile Detailing",
    "image": "https://esmeraldseattledetail.com/logo.png",
    "@id": "",
    "url": "https://esmeraldseattledetail.com",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Seattle",
      "addressRegion": "WA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.6062,
      "longitude": -122.3321
    },
    "areaServed": ["Seattle", "Bellevue", "Redmond", "Kirkland"],
    "priceRange": "$$"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
