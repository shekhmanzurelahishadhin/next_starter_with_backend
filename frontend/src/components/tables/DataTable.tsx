"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  RowData,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import SkeletonLoader from "../ui/skeleton/SkeletonLoader";
import { Filter } from "./Filter";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select" | "none";
    widthClass?: string;
    filterOptions?: { value: string; label: string }[];
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  total?: number;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
  exportFilename?: string;
  exportAllData?: () => Promise<TData[]>;
  showExportAllOption?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pagination,
  onPaginationChange,
  total,
  loading = false,
  onColumnFilterChange,
  exportFilename = "data",
  exportAllData,
  showExportAllOption = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: !!pagination,
    pageCount: pagination && total ? Math.ceil(total / pagination.pageSize) : undefined,
    onPaginationChange: onPaginationChange as any,

    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: pagination || { pageIndex: 0, pageSize: 10 },
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        fileName={exportFilename}
        exportAllData={exportAllData}
        showExportAllOption={showExportAllOption}
        loading={loading}
      />

      <DataTablePagination table={table} total={total} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
        
        {/* Single Table Container with Sticky Header */}
        <div className="overflow-auto max-h-[90vh] scrollbar-hide">
          <Table>
            <TableHeader className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
              {/* Header Row */}
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();
                    const widthClass = header.column.columnDef.meta?.widthClass || "";
                    const headerText = String(header.column.columnDef.header || '');
                    
                    return (
                      <TableCell
                        key={header.id}
                        isHeader
                        className={`px-4 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${widthClass} ${
                          headerText.includes('text-center') ? 'text-center' : 'text-start'
                        }`}
                        style={{ 
                          minWidth: header.column.getSize(),
                          width: header.column.getSize()
                        }}
                      >
                        <div
                          className={`${
                            headerText.includes('text-center')
                              ? 'flex justify-center'
                              : 'flex items-center space-x-2'
                          } ${canSort ? "cursor-pointer select-none group" : ""}`}
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          <span className="transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {canSort && (
                            <span className="flex flex-col gap-0.1">
                              <svg
                                className={`h-2 w-2 transition-colors ${
                                  isSorted === "asc"
                                    ? "text-primary dark:text-primary"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="5"
                                fill="none"
                              >
                                <path
                                  fill="currentColor"
                                  d="M4.41.585a.5.5 0 0 0-.82 0L1.05 4.213A.5.5 0 0 0 1.46 5h5.08a.5.5 0 0 0 .41-.787z"
                                />
                              </svg>
                              <svg
                                className={`h-2 w-2 transition-colors ${
                                  isSorted === "desc"
                                    ? "text-primary dark:text-primary"
                                    : "text-gray-300 dark:text-gray-400/50"
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="5"
                                fill="none"
                              >
                                <path
                                  fill="currentColor"
                                  d="M4.41 4.415a.5.5 0 0 1-.82 0L1.05.787A.5.5 0 0 1 1.46 0h5.08a.5.5 0 0 1 .41.787z"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              
              {/* Filter Row - Also Sticky */}
              {table.getHeaderGroups()[0].headers.some((header) => {
                const meta = header.column.columnDef.meta;
                return header.column.getCanFilter() && meta?.filterVariant !== "none";
              }) && (
                <TableRow className="sticky top-[48px] z-30 bg-white dark:bg-gray-800">
                  {table.getHeaderGroups()[0].headers.map((header) => {
                    const canFilter = header.column.getCanFilter();
                    const meta = header.column.columnDef.meta ?? {};
                    const showFilter = canFilter && meta.filterVariant !== "none";

                    return (
                      <TableCell
                        key={header.id}
                        isHeader
                        className={`text-start px-4 pb-2 ${meta.widthClass || ""}`}
                        style={{ 
                          minWidth: header.column.getSize(),
                          width: header.column.getSize()
                        }}
                      >
                        {showFilter ? (
                          <Filter
                            column={header.column}
                            options={meta.filterOptions}
                            onFilterChange={onColumnFilterChange}
                          />
                        ) : (
                          <div className="h-7"></div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <SkeletonLoader
                  columns={columns}
                  rowCount={
                    table.getRowModel().rows?.length > 0
                      ? table.getRowModel().rows.length
                      : 5
                  }
                  widthClasses={columns.map((c) => c.meta?.widthClass || "")}
                />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400 ${
                          cell.column.columnDef.meta?.widthClass || ""
                        }`}
                        style={{ 
                          minWidth: cell.column.getSize(),
                          width: cell.column.getSize()
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Bottom */}
      <DataTablePagination table={table} total={total} />
    </div>
  );
}
