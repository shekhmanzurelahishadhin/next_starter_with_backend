import { Metadata } from "next";
import DataTableComponent from "./DataTableComponent";
export const metadata: Metadata = {
  title: "Next.js Data Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Data Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};
export default function TablesPage() {
 

  return (
   <DataTableComponent/>
  );
}