"use client";

import { Table } from "@tanstack/react-table";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { DownloadIcon, CopyIcon, FileIcon, GridIcon } from "../../icons/index";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  fileName?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  fileName = "data",
}: DataTableToolbarProps<TData>) {

  // Helper: Get visible headers and row data
  const getVisibleData = () => {
    const headers = table
      .getAllColumns()
      .filter((col) => col.getIsVisible())
      .map((col) => col.columnDef.header as string);

    const data = table.getRowModel().rows.map((row) =>
      table
        .getAllColumns()
        .filter((col) => col.getIsVisible())
        .map((col) => row.getValue(col.id))
    );

    return { headers, data };
  };

  // Copy
  const handleCopy = async () => {
    const { headers, data } = getVisibleData();
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
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn(searchKey)?.setFilterValue(e.target.value)
            }
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
