"use client";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Supplier } from "@/services/supplierService";

interface SupplierDetailViewProps {
  supplier: Supplier;
  formatDate: (dateString?: string) => string;
}

export function SupplierDetailView({ supplier, formatDate }: SupplierDetailViewProps) {

  return (
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Supplier Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {supplier.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Email
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {supplier.email ?? "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Phone
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {supplier.phone ?? "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Address
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {supplier.address ?? "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Balance Type
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {supplier.opening_balance_type == 1
                  ? "Debit"
                  : supplier.opening_balance_type == 2
                    ? "Credit"
                    : "Unknown" }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Opening Balance
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {supplier.opening_balance ?? "-"}
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
                    supplier.status == "1"
                      ? "success"
                      : supplier.status == "0"
                        ? "warning"
                        : "warning"
                  }
                  variant="light"
                >
                  {supplier.status == "1"
                    ? "Active"
                    : supplier.status == "0"
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
                {formatDate(supplier.created_at)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(supplier.updated_at)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}