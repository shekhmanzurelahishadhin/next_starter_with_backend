"use client";

import { Table } from "@tanstack/react-table";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { DownloadIcon, CopyIcon, FileIcon, GridIcon } from "../../icons/index";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect, useCallback } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  fileName?: string;
  onSearchChange?: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  fileName = "data",
  onSearchChange,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState("");

  // Debounce search with useCallback
  const debouncedSearch = useCallback(
    (value: string) => {
      if (onSearchChange) {
        onSearchChange(value);
      } else {
        // Fallback to local filtering if no onSearchChange provided
        table.getColumn(searchKey!)?.setFilterValue(value);
      }
    },
    [onSearchChange, table, searchKey]
  );

  // Effect for debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchValue);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue, debouncedSearch]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchValue(value);
  };

  // Helper: Get visible headers and row data for export
  const getVisibleData = () => {
    const visibleColumns = table
      .getAllColumns()
      .filter((col) => {
        const meta = col.columnDef.meta as any;
        return col.getIsVisible() && (meta?.exportable !== false);
      });

    const headers = visibleColumns.map((col) => {
      const meta = col.columnDef.meta as any;
      return meta?.exportHeader || 
             (typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id);
    });

    const data = table.getRowModel().rows.map((row) =>
      visibleColumns.map((col) => {
        const meta = col.columnDef.meta as any;
        
        // Use exportValue function if provided
        if (meta?.exportValue) {
          return meta.exportValue(row.original, row.index);
        }
        
        // Fallback to raw value
        const value = row.getValue(col.id);
        
        // Handle React elements
        if (value && typeof value === 'object' && 'props' in value) {
          return ''; // Skip React components without exportValue
        }
        
        // Handle dates
        if (col.id.includes('_at') && value) {
          const date = new Date(value as string);
          return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
        }
        
        return value ?? '-';
      })
    );

    return { headers, data };
  };

  // Copy
  const handleCopy = async () => {
    const { headers, data } = getVisibleData();
    console.log(headers, data);
    const text = [headers.join("\t"), ...data.map((r) => r.join("\t"))].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      console.log(" Data copied to clipboard");
    } catch (err) {
      console.error(" Failed to copy: ", err);
    }
  };

  // CSV
  const handleExportCSV = () => {
    const { headers, data } = getVisibleData();
    const csvContent = [headers.join(","), ...data.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".csv";
    link.click();
  };

  // Excel
  const handleExportExcel = () => {
    const { headers, data } = getVisibleData();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, fileName + ".xlsx");
  };

  // PDF
  const handleExportPDF = () => {
    const { headers, data } = getVisibleData();
    const doc = new jsPDF();

    doc.text("Data Export", 14, 12);

    // Call autoTable function directly (not doc.autoTable)
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save(fileName + ".pdf");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* 🔍 Search */}
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-10 w-[250px] lg:w-[300px] border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
          />
        )}
      </div>

      {/* 📦 Export Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          tooltip="Copy"
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <CopyIcon /> Copy
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          tooltip="CSV"
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <FileIcon /> CSV
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          tooltip="Excel"
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <GridIcon /> Excel
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          tooltip="PDF"
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <DownloadIcon /> PDF
        </Button>
      </div>
    </div>
  );
}