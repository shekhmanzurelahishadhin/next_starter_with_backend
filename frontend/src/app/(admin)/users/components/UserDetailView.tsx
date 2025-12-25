"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/services/userService";

interface UserDetailViewProps {
  user: User;
  formatDate: (dateString?: string) => string;
}

export function UserDetailView({ user, formatDate }: UserDetailViewProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="overflow-hidden border rounded-lg border-gray-200 dark:border-gray-700">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                User Name
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {user.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Email
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {user.email ? user.email : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Company
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {user.company ? user.company : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Roles
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 font-semibold dark:text-white/90">
                {user.roles_name ? user.roles_name : '-'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Created At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(user.created_at || null)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-5 py-4 text-gray-600 font-medium bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                Updated At
              </TableCell>
              <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                {formatDate(user.updated_at || null)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}