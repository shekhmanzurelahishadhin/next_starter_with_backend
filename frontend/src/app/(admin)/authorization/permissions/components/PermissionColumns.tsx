import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ActionButtons from "@/components/ui/button/ActionButton";
import { FiEye, FiEdit, FiTrash } from "@/icons/index";
import { Permission } from "@/services/permissionService";
import { ColumnMeta as RTColumnMeta } from '@tanstack/react-table';

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

interface UsePermissionColumnsProps {
  hasPermission: (permission: string) => boolean;
  onView: (permission: Permission) => void;
  onEdit: (permission: Permission) => void;
  onDelete: (id: number) => void;
  pageIndex: number;
  pageSize: number;
}

export const usePermissionColumns = ({
  hasPermission,
  onView,
  onEdit,
  onDelete,
  pageIndex,
  pageSize,
}: UsePermissionColumnsProps): ColumnDef<Permission>[] => {
  return useMemo((): ColumnDef<Permission>[] => [
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
      header: "Permission Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search names",
        exportable: true,
        exportHeader: "Permission Name",
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
      accessorKey: "module_name",
      header: "Module Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search Module",
        exportable: true,
        exportHeader: "Module Name",
        exportValue: (row) => row.module_name,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const module_name = row.getValue("module_name") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {module_name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "menu_name",
      header: "Menu Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search Menu",
        exportable: true,
        exportHeader: "Menu Name",
        exportValue: (row) => row.menu_name,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const menu_name = row.getValue("menu_name") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {menu_name}
            </span>
          </div>
        );
      },
    },
   {
      accessorKey: "sub_menu_name",
      header: "Sub Menu Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search Menu",
        exportable: true,
        exportHeader: "Menu Name",
        exportValue: (row) => row.sub_menu_name,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const sub_menu_name = row.getValue("sub_menu_name") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {sub_menu_name}
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
        exportValue: (row) => {
          if (!row.created_at) return "-";
          const [datePart] = row.created_at.split(" ");
          const [y, m, d] = datePart.split("-");
          return `${d}-${m}-${y}`;
        },
        widthClass: "w-[120px]"
      },
      cell: ({ row }) => {
        const value = row.getValue("created_at");
        if (!value) {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
        }
        const [datePart] = (value as string).split(" ");
        const [y, m, d] = datePart.split("-");
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {`${d}-${m}-${y}`}
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
        exportValue: (row) => {
          if (!row.updated_at) return "-";
          const [datePart] = row.updated_at.split(" ");
          const [y, m, d] = datePart.split("-");
          return `${d}-${m}-${y}`;
        },
        widthClass: "w-[120px]"
      },
      cell: ({ row }) => {
        const value = row.getValue("updated_at");
        if (!value) {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
        }
        const [datePart] = (value as string).split(" ");
        const [y, m, d] = datePart.split("-");
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {`${d}-${m}-${y}`}
          </span>
        );
      },
    },
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
        const permission = row.original;
        return (
          <ActionButtons
            row={permission}
            buttons={[
              {
                icon: FiEye,
                onClick: (row) => onView(row as Permission),
                variant: "success",
                size: "sm",
                tooltip: "View",
                show: () => hasPermission("permission.view"),
              },
              {
                icon: FiEdit,
                onClick: (row) => onEdit(row as Permission),
                variant: "primary",
                size: "sm",
                tooltip: "Edit",
                show: () => hasPermission("permission.edit"),
              },
              {
                icon: FiTrash,
                onClick: (row) => onDelete((row as Permission).id),
                variant: "danger",
                size: "sm",
                tooltip: "Delete",
                show: () => hasPermission("permission.delete"),
              },
            ]}
          />
        );
      },
    },
  ], [hasPermission, onView, onEdit, onDelete, pageIndex, pageSize]);
};