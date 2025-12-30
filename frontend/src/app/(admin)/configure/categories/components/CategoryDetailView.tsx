"use client";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/services/categoryService";

interface CategoryDetailViewProps {
  category: Category;
  formatDate: (dateString?: string) => string;
}

export function CategoryDetailView({ category, formatDate }: CategoryDetailViewProps) {
 
  return (
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Category Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {category.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Description
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {category.description}
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
                    category.status == "1"
                      ? "success"
                      : category.status == "0"
                        ? "warning"
                        : "warning"
                  }
                  variant="light"
                >
                  {category.status == "1"
                    ? "Active"
                    : category.status == "0"
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
                {formatDate(category.created_at)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(category.updated_at)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}