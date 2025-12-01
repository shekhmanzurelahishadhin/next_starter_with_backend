"use client";

import { useState, useEffect, useRef } from "react";
import { Column } from "@tanstack/react-table";

interface FilterProps {
  column: Column<any, unknown>;
  options?: { value: string; label: string }[];
  onFilterChange?: (columnId: string, value: string) => void;
}

export function Filter({ column, options, onFilterChange }: FilterProps) {
  const [value, setValue] = useState("");
  const { filterVariant } = column.columnDef.meta ?? {};
  const filterOptions = options || column.columnDef.meta?.filterOptions;
  const previousValueRef = useRef("");

    // Get column header text for placeholder
  const getColumnHeaderText = () => {
    const header = column.columnDef.header;
    if (typeof header === "string") {
      return header;
    }
    if (typeof header === "function") {
      // Try to extract text from header function result
      return "Filter";
    }
    return "Filter";
  };

  // Get placeholder from meta or use header text
  const placeholder = column.columnDef.meta?.placeholder || `Search ${getColumnHeaderText()}`;


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
        className="w-full max-w-[120px] text-xs h-7 rounded border border-gray-300 dark:border-gray-700  focus:border-brand-300 dark:focus:border-brand-800 border-stroke px-2 text-gray-700 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-gray-300"
      >
        <option className="text-gray-700 dark:bg-gray-900 dark:text-gray-400" value="">All</option>
        {filterOptions?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      // placeholder={placeholder}
      className="w-full max-w-[120px] text-xs h-7 rounded border border-gray-300 dark:border-gray-700 focus:border-brand-300 dark:focus:border-brand-800 border-stroke px-2 text-gray-700 placeholder-gray-400 focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-gray-300 dark:placeholder-gray-500"
    />
  );
}