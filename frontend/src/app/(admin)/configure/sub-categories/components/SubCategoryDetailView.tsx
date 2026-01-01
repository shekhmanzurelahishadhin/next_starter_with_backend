"use client";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { SubCategory } from "@/services/subCategoryService";

interface SubCategoryDetailViewProps {
  subCategory: SubCategory;
  formatDate: (dateString?: string) => string;
}

export function SubCategoryDetailView({ subCategory, formatDate }: SubCategoryDetailViewProps) {
 
  return (
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Sub Category Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {subCategory.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Description
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {subCategory.description}
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
                    subCategory.status == "1"
                      ? "success"
                      : subCategory.status == "0"
                        ? "warning"
                        : "warning"
                  }
                  variant="light"
                >
                  {subCategory.status == "1"
                    ? "Active"
                    : subCategory.status == "0"
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
                {formatDate(subCategory.created_at)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(subCategory.updated_at)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}