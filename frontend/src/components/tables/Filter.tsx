"use client";

import { useState, useEffect, useRef } from "react";
import { Column } from "@tanstack/react-table";

interface FilterProps {
  column: Column<any, unknown>;
  onFilterChange?: (columnId: string, value: string) => void;
}

export function Filter({ column, onFilterChange }: FilterProps) {
  const [value, setValue] = useState("");
  const { filterVariant } = column.columnDef.meta ?? {};
  const previousValueRef = useRef("");

  // Debounce effect
  useEffect(() => {
    if (!onFilterChange || value === previousValueRef.current) return;

    const timeout = setTimeout(() => {
      previousValueRef.current = value;
      onFilterChange(column.id, value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value, column.id, onFilterChange]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    
    // Clear filter immediately when empty
    if (newValue === "" && onFilterChange) {
      previousValueRef.current = "";
      onFilterChange(column.id, newValue);
    }
  };

  if (filterVariant === "select") {
    return (
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full max-w-[120px] text-xs h-7 rounded border border-stroke px-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300"
      >
        <option className="text-gray-700 dark:bg-gray-900 dark:text-gray-400" value="">All</option>
        {/* Options will be populated from server-side data */}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={`Filter...`}
      className="w-full max-w-[120px] text-xs h-7 rounded border border-stroke px-2 text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 dark:border-strokedark dark:bg-boxdark dark:text-gray-300 dark:placeholder-gray-500"
    />
  );
}