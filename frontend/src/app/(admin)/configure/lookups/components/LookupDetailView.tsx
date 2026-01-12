"use client";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Lookup } from "@/services/lookupService";

interface LookupDetailViewProps {
  lookup: Lookup;
  formatDate: (dateString?: string) => string;
}

export function LookupDetailView({ lookup, formatDate }: LookupDetailViewProps) {
 
  return (
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Lookup Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {lookup.name}
              </TableCell>
            </TableRow>
              <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Type
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {lookup.type}
              </TableCell>
            </TableRow>
              <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Code
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {lookup.code}
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
                    lookup.status == 1
                      ? "success"
                      : lookup.status == 0
                        ? "warning"
                        : "warning"
                  }
                  variant="light"
                >
                  {lookup.status == 1
                    ? "Active"
                    : lookup.status == 0
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
                {formatDate(lookup.created_at)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(lookup.updated_at)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}