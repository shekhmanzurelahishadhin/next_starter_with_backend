import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ActionButtons from "@/components/ui/button/ActionButton";
import { FiEye, FiEdit, FiTrash, FaUserTag } from "@/icons/index";
import { User } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    filterVariant?: 'text' | 'select' | 'none';
    filterOptions?: { value: string; label: string }[];
    exportable?: boolean;
    exportHeader?: string;
    placeholder?: string;
    exportValue?: (row: TData, index?: number) => string | number;
    widthClass?: string;
  }
}

interface UseUserColumnsProps {
  hasPermission: (permission: string) => boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  pageIndex: number;
  pageSize: number;
  formatDate: (dateString?: string) => string;
}

export const useUserColumns = ({
  hasPermission,
  onView,
  onEdit,
  onDelete,
  pageIndex,
  pageSize,
  formatDate,
}: UseUserColumnsProps): ColumnDef<User>[] => {
  const {user: currentLoginUser} = useAuth();
   const router = useRouter();

  return useMemo((): ColumnDef<User>[] => [
    {
      id: "sl",
      header: "SL",
      enableSorting: false,
      meta: {
        filterVariant: "none",
        exportable: true,
        exportHeader: "SL",
        exportValue: (row, index) => (pageIndex * pageSize) + (index ?? 0) + 1,
        widthClass: "w-[30px]"
      },
      cell: ({ row }) => {
        const serialNumber = (pageIndex * pageSize) + row.index + 1;
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {serialNumber}
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "User Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search names",
        exportable: true,
        exportHeader: "User Name",
        exportValue: (row) => row.name,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search emails",
        exportable: true,
        exportHeader: "Email",
        exportValue: (row) => row.email,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {email}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "roles_name",
      header: "Roles",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search Roles",
        exportable: true,
        exportHeader: "Roles",
        exportValue: (row) => row.roles_name,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const roles_name = row.getValue("roles_name") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {roles_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "company",
      header: "Company",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search Company",
        exportable: true,
        exportHeader: "Company",
        exportValue: (row) => row.company || "-",
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const company = row.getValue("company") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {company}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      enableSorting: true,
      meta: {
        exportable: true,
        exportHeader: "Created At",
        placeholder: "Search created at",
        exportValue: (row) => formatDate(row.created_at),
        widthClass: "w-[120px]",
      },
      cell: ({ row }) => {
        const value = row.getValue("created_at") as string | undefined;
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(value)}
          </span>
        );
      },
    },

    {
      accessorKey: "updated_at",
      header: "Updated At",
      enableSorting: true,
      meta: {
        exportable: true,
        exportHeader: "Updated At",
        placeholder: "Search updated at",
        exportValue: (row) => formatDate(row.updated_at),
        widthClass: "w-[120px]",
      },
      cell: ({ row }) => {
        const value = row.getValue("updated_at") as string | undefined;
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {formatDate(value)}
          </span>
        );
      },
    }
    ,
    {
      id: "Actions",
      header: () => <div className="">Actions</div>,
      enableSorting: false,
      meta: {
        filterVariant: "none",
        exportable: false,
        widthClass: "w-[150px]"
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <ActionButtons
            row={user}
            buttons={[
              {
                icon: FiEye,
                onClick: (row) => onView(row as User),
                variant: "success",
                size: "sm",
                tooltip: "View",
                show: () => hasPermission("user.view"),
              },
              {
                icon: FiEdit,
                onClick: (row) => onEdit(row as User),
                variant: "primary",
                size: "sm",
                tooltip: "Edit",
                show: (user) =>
                !user.roles_name?.includes("Super Admin") &&
                hasPermission("user.edit"),
              },
              {
                icon: FaUserTag,
                onClick: (user) =>
                router.push(`/dashboard/users/role-permissions/${user.id}`),
                variant: "info",
                size: "sm",
                tooltip: "Assign Permissions",
                show: (user) =>
                !user.roles_name?.includes("Super Admin") &&
                hasPermission("user.assign-permissions"),
              },
              {
                icon: FiTrash,
                onClick: (row) => onDelete((row as User).id),
                variant: "danger",
                size: "sm",
                tooltip: "Delete",
                show: (user) =>
                !user.roles_name?.includes("Super Admin") &&
                hasPermission("user.delete") && user.id !== currentLoginUser?.id,
              },
            ]}
          />
        );
      },
    },
  ], [hasPermission, onView, onEdit, onDelete, pageIndex, pageSize]);
};
