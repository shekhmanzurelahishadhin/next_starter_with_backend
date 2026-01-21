"use client";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Company } from "@/services/companyService";
import Image from "next/image";
import { useMemo, useState } from "react"; // Add useState

interface CompanyDetailViewProps {
  company: Company;
  formatDate: (dateString?: string) => string;
}

export function CompanyDetailView({ company, formatDate }: CompanyDetailViewProps) {
  const [imageError, setImageError] = useState(false);
  
  // Helper function to get full logo URL
  const getLogoUrl = useMemo(() => {
    if (!company.logo) return null;
    
    // If logo already has full URL, use it
    if (company.logo.startsWith('http://') || company.logo.startsWith('https://')) {
      return company.logo;
    }
    
    // Get backend URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // Remove any leading slashes from the logo path
    const logoPath = company.logo.startsWith('/') ? company.logo.slice(1) : company.logo;
    
    // Construct the full URL to access the logo from Laravel storage
    return `${baseUrl}/storage/${logoPath}`;
  }, [company.logo]);

  // For Next.js Image component, we need to configure the domain in next.config.js
  const logoUrl = getLogoUrl;

  return (
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {/* Logo Row */}
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Logo
              </TableCell>
              <TableCell className="px-5 py-4">
                {logoUrl && !imageError ? (
                  <div className="flex items-center">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
                      <Image
                        src={logoUrl}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                        onError={() => setImageError(true)}
                        unoptimized={true} // Add this if you're having issues with external images
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                      {company.logo ? 'Failed to load logo' : 'No logo'}
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Company Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {company.name}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Status
              </TableCell>
              <TableCell className="px-5 py-4">
                <Badge
                  size="sm"
                  color={
                    company.status == "1"
                      ? "success"
                      : company.status == "0"
                        ? "warning"
                        : "warning"
                  }
                  variant="light"
                >
                  {company.status == "1"
                    ? "Active"
                    : company.status == "0"
                      ? "Inactive"
                      : "Unknown"}
                </Badge>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Created At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(company.created_at)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(company.updated_at)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}