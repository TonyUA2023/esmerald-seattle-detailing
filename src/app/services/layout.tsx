import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Detailing Services & Prices in Seattle | Esmerald Apex",
  description: "Explore our premium mobile auto detailing packages in Seattle, Bellevue & Kirkland. We offer interior deep cleaning, exterior hand wash, ceramic coating, and paint correction at your home or office.",
  keywords: "mobile detailing services, car wash prices seattle, interior car cleaning, ceramic coating packages, paint correction bellevue, mobile auto detailing redmond",
  openGraph: {
    title: "Mobile Detailing Services & Prices in Seattle | Esmerald Apex",
    description: "Explore our premium mobile auto detailing packages in Seattle, Bellevue & Kirkland. Interior deep cleaning, exterior wash, and ceramic coating.",
    url: "https://esmeraldseattledetail.com/services",
    siteName: "Esmerald Mobile Detailing",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://esmeraldseattledetail.com/services",
  }
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
