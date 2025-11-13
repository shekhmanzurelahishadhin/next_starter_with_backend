"use client";
import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

interface Option {
  value: string | number;
  label: string;
}

interface ReactMultiSelectProps {
  value: (string | number)[];
  options: Option[];
  onChange: (values: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
}

const ReactMultiSelect: React.FC<ReactMultiSelectProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select options",
  className = "",
}) => {
  const animatedComponents = makeAnimated();

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Select
      isMulti
      unstyled
      components={animatedComponents}
      classNamePrefix="select"
      value={selectedOptions}
      onChange={(selected) => onChange(selected.map((s: any) => s.value))}
      options={options}
      placeholder={placeholder}
      classNames={{
        control: ({ isFocused }) =>
          [
            "flex min-h-[44px] !min-h-[44px] w-full items-center rounded-lg border px-2 py-1.5 text-sm",
            "transition-all duration-200 appearance-none shadow-theme-xs flex-wrap",
            isFocused
              ? "border-brand-300 ring-3 ring-brand-500/10"
              : "border-gray-300 dark:border-gray-700",
            "bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90",
            "placeholder:text-gray-400 dark:placeholder:text-white/30",
            "focus:outline-hidden",
          ].join(" "),
        valueContainer: () =>
          "flex flex-wrap gap-1 px-1 py-0.5 text-sm text-gray-800 dark:text-white/90",
        multiValue: () =>
          "flex items-center gap-1 rounded-md bg-brand-100 dark:bg-brand-800 px-2 py-0.5 text-sm text-brand-700 dark:text-white",
        multiValueLabel: () => "truncate",
        multiValueRemove: () =>
          "ml-1 text-gray-500 hover:text-red-500 cursor-pointer",
        indicatorsContainer: () =>
          "flex items-center pr-2 text-gray-400 dark:text-gray-500",
        dropdownIndicator: ({ isFocused }) =>
          `transition-colors ${isFocused ? "text-brand-500" : "hover:text-gray-500"}`,
        indicatorSeparator: () => "hidden",
        menu: () =>
          "mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50",
        option: ({ isFocused, isSelected }) =>
          [
            "px-3 py-2 text-sm cursor-pointer select-none",
            isSelected
              ? "bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-white"
              : "text-gray-800 dark:text-gray-200",
            isFocused && !isSelected
              ? "bg-gray-100 dark:bg-gray-800"
              : "hover:bg-gray-100 dark:hover:bg-gray-800",
          ].join(" "),
        noOptionsMessage: () =>
          "text-gray-500 dark:text-gray-400 px-3 py-2 text-sm",
      }}
      className={`w-full ${className}`}
    />
  );
};

export default ReactMultiSelect;
