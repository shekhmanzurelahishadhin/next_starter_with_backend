"use client";

import { Table } from "@tanstack/react-table";
import Button from "../ui/button/Button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (pageCount <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis logic
      let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
      
      if (endPage >= pageCount) {
        endPage = pageCount - 1;
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-2 sm:flex-row sm:gap-0">
      {/* Left side: selected rows info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      {/* Right side: pagination controls */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">Rows per page</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 w-[60px] rounded border text-gray-500 border-stroke px-1 text-sm
              dark:border-strokedark dark:bg-boxdark"
          >
            {[2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option className="text-gray-700 dark:bg-gray-900 dark:text-gray-400" key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/* Page info */}
        <div className="text-xs text-gray-500 font-medium sm:text-sm">
          Page {currentPage + 1} of {pageCount}
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* First page button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 md:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          
          {/* Previous page button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>

           {/* Page number buttons */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageIndex) => (
              <Button
                key={pageIndex}
                variant={currentPage === pageIndex ? "default" : "outline"}
                 className={`px-4 py-2 rounded ${
              currentPage === pageIndex
                ? "bg-brand-500 text-white"
                : "text-gray-700 dark:text-gray-400"
            } flex w-8 items-center justify-center h-8 rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-brand-500 dark:hover:text-brand-500`}
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageIndex + 1}
              </Button>
            ))}
          </div>

          {/* Next page button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          
          {/* Last page button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 md:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}