import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Detailing Gallery & Portfolio Seattle | Esmerald Apex",
  description: "View our portfolio of professional mobile auto detailing in Seattle, Bellevue & Redmond. See amazing before and after photos of interior deep cleans, ceramic coatings, and paint corrections.",
  keywords: "auto detailing gallery, car wash before after, mobile detailing portfolio seattle, ceramic coating results, paint correction before and after, car detailing pictures bellevue",
  openGraph: {
    title: "Auto Detailing Gallery & Portfolio Seattle | Esmerald Apex",
    description: "View our portfolio of professional mobile auto detailing in Seattle. See amazing photos of interior deep cleans, ceramic coatings, and paint corrections.",
    url: "https://esmeraldseattledetail.com/gallery",
    siteName: "Esmerald Mobile Detailing",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://esmeraldseattledetail.com/gallery",
  }
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
