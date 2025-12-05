"use client";

import { Table } from "@tanstack/react-table";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { DownloadIcon, CopyIcon, FileIcon, GridIcon } from "../../icons/index";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  fileName?: string;
  onSearchChange?: (value: string) => void;
  exportAllData?: () => Promise<TData[]>;
  showExportAllOption?: boolean;
  loading?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  fileName = "data",
  onSearchChange,
  exportAllData,
  showExportAllOption = false,
  loading = false,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState("");
  const [isExporting, setIsExporting] = useState(false);

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
  const getVisibleData = (dataToExport: TData[]) => {
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

    const data = dataToExport.map((row, rowIndex) =>
      visibleColumns.map((col) => {
        const meta = col.columnDef.meta as any;
        
        // Use exportValue function if provided
         if (meta?.exportValue) {
          return meta.exportValue(row, rowIndex);
        }
        
        // Fallback to raw value
        const value = (row as any)[col.id];
        
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

  // Export current page data
  const exportCurrentData = () => {
    const { headers, data } = getVisibleData(table.getRowModel().rows.map(row => row.original));
    return { headers, data };
  };

  // Copy
  const handleCopy = async () => {
    const { headers, data } = exportCurrentData();
    const text = [headers.join("\t"), ...data.map((r) => r.join("\t"))].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Data copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy data");
      console.error("Failed to copy: ", err);
    }
  };

  // Export with option for all data
  const handleExport = async (
    format: 'csv' | 'excel' | 'pdf',
    exportAll: boolean = false
  ) => {
    try {
      setIsExporting(true);
      let exportData = table.getRowModel().rows.map(row => row.original);
      
      // If export all is requested and function is provided
      if (exportAll && exportAllData) {
        try {
          exportData = await exportAllData();
        } catch (error) {
          console.error("Error loading all data:", error);
          return;
        }
      }

      const { headers, data } = getVisibleData(exportData);

      switch (format) {
        case 'csv':
          exportToCSV(headers, data, fileName);
          break;
        case 'excel':
          exportToExcel(headers, data, fileName);
          break;
        case 'pdf':
          exportToPDF(headers, data, fileName);
          break;
      }
    } catch (error) {
      console.error(`Export error:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  // CSV export function
  const exportToCSV = (headers: string[], data: any[][], filename: string) => {
    const csvContent = [headers.join(","), ...data.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".csv";
    link.click();
  };

  // Excel export function
  const exportToExcel = (headers: string[], data: any[][], filename: string) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, filename + ".xlsx");
  };

  // PDF export function
  const exportToPDF = (headers: string[], data: any[][], filename: string) => {
    const doc = new jsPDF();
    doc.text(`${filename} Export`, 14, 12);
    
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 99, 235] }, // Primary color
    });
    
    doc.save(filename + ".pdf");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Search */}
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-10 w-[250px] lg:w-[300px] border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
            disabled={isExporting}
          />
        )}
      </div>

      {/* 📦 Export Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Copy Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          tooltip="Copy Page"
          disabled={isExporting || loading}
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <CopyIcon /> Copy
        </Button>

        {/* CSV Export */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv', showExportAllOption)}
            tooltip="Export as CSV"
            disabled={isExporting || loading}
            className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
          >
            <FileIcon /> CSV
          </Button>
        </div>

        {/* Excel Export */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel', showExportAllOption)}
            tooltip="Export as Excel"
            disabled={isExporting || loading}
            className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
          >
            <GridIcon /> Excel
          </Button>
        </div>

        {/* PDF Export */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf', showExportAllOption)}
            tooltip="Export as PDF"
            disabled={isExporting || loading}
            className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
          >
            <DownloadIcon /> PDF
          </Button>
        </div>
      </div>
    </div>
  );
}