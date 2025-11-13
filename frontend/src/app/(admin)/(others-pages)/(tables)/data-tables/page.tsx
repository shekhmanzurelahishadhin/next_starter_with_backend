import { Metadata } from "next";
import DataTableComponent from "./DataTableComponent";
export const metadata: Metadata = {
  title: "Next.js Data Table | TailAdmin",
  description: "Data table page for TailAdmin",
  keywords: ["data table", "dashboard", "tailwind"],
  authors: [{ name: "Your Name", url: "https://example.com" }],
  openGraph: { // Open Graph metadata used for social media sharing
    title: "Next.js Data Table", 
    description: "Interactive data table",
    url: "https://example.com/data-table",
    siteName: "TailAdmin",
    images: [{ url: "https://example.com/og-image.png" }],
  },
  robots: { index: true, follow: true },
};
export default function TablesPage() {
 

  return (
   <DataTableComponent/>
  );
}