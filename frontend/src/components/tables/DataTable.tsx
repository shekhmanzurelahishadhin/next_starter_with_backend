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
  Column,
  RowData,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import Spinner from "../ui/spinner/Spinner";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select" | "none";
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  // Server-side pagination props
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  total?: number;
  loading?: boolean;
  onSearchChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  pagination,
  onPaginationChange,
  total,
  loading = false,
  onSearchChange,
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
    // Server-side pagination
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
        fileName="roles"
        onSearchChange={onSearchChange}
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {/* Header Row */}
                <TableRow>
                  {table.getHeaderGroups()[0].headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <TableCell
                        key={header.id}
                        isHeader
                        className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${
                          String(header.column.columnDef.header).includes('text-center') ? 'text-center' : 'text-start'
                          }`}
                      >
                        <div
                          className={` ${String(header.column.columnDef.header).includes('text-center')
                              ? 'flex justify-center'
                              : 'flex items-center space-x-2'
                            } ${canSort ? "cursor-pointer select-none group" : ""
                            }`}
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
                                className={`h-2 w-2 transition-colors ${isSorted === "asc"
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
                                className={`h-2 w-2 transition-colors ${isSorted === "desc"
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

                {/* Filter Row - Only show if any column has filters */}
                {(table.getHeaderGroups()[0].headers.some(header => {
                  const canFilter = header.column.getCanFilter();
                  const { filterVariant } = header.column.columnDef.meta ?? {};
                  return canFilter && filterVariant !== "none";
                })) && (
                    <TableRow>
                      {table.getHeaderGroups()[0].headers.map((header) => {
                        const canFilter = header.column.getCanFilter();
                        const { filterVariant } = header.column.columnDef.meta ?? {};
                        const showFilter = canFilter && filterVariant !== "none";

                        return (
                          <TableCell
                            key={header.id}
                            isHeader
                            className="text-start px-5 py-2"
                          >
                            {showFilter ? (
                              <Filter column={header.column} />
                            ) : (
                              <div className="h-7"></div> // Empty space for alignment
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400"
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
                      No roles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <DataTablePagination 
        table={table} 
        total={total}
        loading={loading}
      />
    </div>
  );
}

// Filter Component 
function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};
  const [value, setValue] = useState(columnFilterValue ?? "");

  // Debounce filter updates
  useEffect(() => {
    const timeout = setTimeout(() => {
      column.setFilterValue(value || undefined);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, column]);

  // Get unique values for select filter
  const getUniqueValues = () => {
    const uniqueValues = new Set<string>();
    column.getFacetedRowModel()?.flatRows.forEach((row) => {
      const value = row.getValue(column.id);
      if (value != null && value !== "") {
        uniqueValues.add(String(value));
      }
    });
    return Array.from(uniqueValues).sort();
  };

  if (filterVariant === "select") {
    const uniqueValues = getUniqueValues();

    return (
      <select
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        className="w-full max-w-[120px] text-xs h-7 rounded border border-stroke px-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300"
      >
        <option className="text-gray-700 dark:bg-gray-900 dark:text-gray-400" value="">All</option>
        {uniqueValues.map((value) => (
          <option className="text-gray-700 dark:bg-gray-900 dark:text-gray-400" key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }

  // Default to text input
  return (
    <input
      type="text"
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      placeholder={`Filter...`}
      className="w-full max-w-[120px] text-xs h-7 rounded border border-stroke px-2 text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300 dark:placeholder-gray-500"
    />
  );
}