import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ActionButtons from "@/components/ui/button/ActionButton";
import { FiEye, FiEdit, FiTrash } from "@/icons/index";
import { SubCategory } from "@/services/subCategoryService";

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

interface UseSubCategoryColumnsProps {
  hasPermission: (permission: string) => boolean;
  onView: (subCategory: SubCategory) => void;
  onEdit: (subCategory: SubCategory) => void;
  handleSoftDelete: (id: number) => void;
  handleForceDelete: (id: number) => void;
  handleRestore: (id: number) => void;
  pageIndex: number;
  pageSize: number;
  formatDate: (dateString?: string) => string;
  status: { value: string; label: string }[];
}

export const useSubCategoryColumns = ({
  hasPermission,
  onView,
  onEdit,
  handleSoftDelete,
  handleForceDelete,
  pageIndex,
  pageSize,
  formatDate,
  status,
}: UseSubCategoryColumnsProps): ColumnDef<SubCategory>[] => {
  return useMemo((): ColumnDef<SubCategory>[] => [
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
      header: "SubCategory Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search names",
        exportable: true,
        exportHeader: "SubCategory Name",
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
      accessorKey: "description",
      header: "Description",
      enableSorting: true,
      meta: {
        filterVariant: "text",
        placeholder: "Search descriptions",
        exportable: true,
        exportHeader: "Description",
        exportValue: (row) => row.description,
        widthClass: "w-[200px]"
      },
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 dark:text-white/90 truncate">
              {description}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      meta: {
        filterVariant: "select",
        filterOptions: status.map((s) => ({ value: s.value.toString(), label: s.label })),
        exportable: true,
        exportHeader: "Status",
        exportValue: (row) => (Number(row.status) === 1 ? "Active" : "Inactive"),
        widthClass: "w-[100px] min-w-[90px] max-w-[110px]",
        minWidth: "90px",
        maxWidth: "110px"
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as number;
        return (
          <div className="px-2">
            {row.original.deleted_at ? (
              <span className="px-2 py-1 rounded-full text-[12px] font-medium bg-gray-100 text-gray-800 dark:bg-red-800/30 dark:text-gray-400">
                Trashed
              </span>
            ) : (
              <span
                className={`px-2 py-1 rounded-full text-[12px] font-medium ${status === 1
                    ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
                    : "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400"
                  }`}
              >
                {status === 1 ? "Active" : "Inactive"}
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "created_at",
      header: "Created",
      enableSorting: true,
      meta: {
        exportable: true,
        exportHeader: "Created At",
        placeholder: "Search created",
        exportValue: (row) => formatDate(row.created_at),
        widthClass: "w-[120px] min-w-[110px] max-w-[130px]",
        minWidth: "110px",
        maxWidth: "130px"
      },
      cell: ({ row }) => {
        const value = row.getValue("created_at") as string | undefined;
        return (
          <div className="px-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {formatDate(value)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      enableSorting: true,
      meta: {
        exportable: true,
        exportHeader: "Updated At",
        placeholder: "Search updated",
        exportValue: (row) => formatDate(row.updated_at),
        widthClass: "w-[120px] min-w-[110px] max-w-[130px]",
        minWidth: "110px",
        maxWidth: "130px"
      },
      cell: ({ row }) => {
        const value = row.getValue("updated_at") as string | undefined;
        return (
          <div className="px-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {formatDate(value)}
            </span>
          </div>
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
        const subCategory = row.original;
        return (
          <ActionButtons
            row={subCategory}
            buttons={[
              {
                icon: FiEye,
                onClick: (row) => onView(row as SubCategory),
                variant: "success",
                size: "sm",
                tooltip: "View",
                show: () => hasPermission("sub-category.view"),
              },
              {
                icon: FiEdit,
                onClick: (row) => onEdit(row as SubCategory),
                variant: "primary",
                size: "sm",
                tooltip: "Edit",
                show: () => hasPermission("sub-category.edit"),
              },
              {
                icon: FiTrash,
                onClick: (row) => handleSoftDelete((row as SubCategory).id),
                variant: "danger",
                size: "sm",
                tooltip: "Move to Trash",
                show: () => hasPermission("sub-category.delete"),
              },
            ]}
          />
        );
      },
    },
  ], [hasPermission, onView, onEdit, handleForceDelete, handleSoftDelete, pageIndex, pageSize]);
};