import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Mobile Detailing Seattle - Book Your Free Quote",
  description: "Top-rated mobile auto detailing near you in Seattle, Bellevue, Redmond, and Kirkland. We restore your vehicle's shine at your home or office.",
  openGraph: {
    title: "Mobile Detailing Seattle - Book Your Free Quote",
    description: "Top-rated mobile auto detailing near you in Seattle. We restore your vehicle's shine at your home or office.",
    url: "https://esmeraldseattledetail.com",
    siteName: "Esmeral Mobile Detailing",
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
    "name": "Esmeral Mobile Detailing",
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
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MBFND75X');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className={`${montserrat.variable} ${inter.variable}`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MBFND75X"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
