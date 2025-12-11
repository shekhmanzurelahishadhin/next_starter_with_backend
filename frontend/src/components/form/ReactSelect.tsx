"use client";
import React from "react";
import Select, { SingleValue } from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface ReactSelectProps {
  options: Option[];
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  name?: string;
  className?: string;
  success?: boolean;          // optional success state
  error?: string | boolean;   // string for message or boolean
}

const ReactSelect: React.FC<ReactSelectProps> = ({
  options,
  value = null,
  onChange,
  placeholder = "Select an option",
  isDisabled = false,
  isLoading = false,
  isClearable = true,
  isRtl = false,
  isSearchable = true,
  name = "select",
  className = "",
  success = false,
  error = false,
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected: SingleValue<Option>) => {
    onChange(selected ? selected.value : null);
  };

  const hasError = Boolean(error);

  return (
    <div className={`w-full ${className}`}>
      <Select
        unstyled
        classNamePrefix="select"
        value={selectedOption}
        onChange={handleChange}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name={name}
        options={options}
        placeholder={placeholder}
        classNames={{
          control: ({ isFocused }) => {
            let base = [
              "flex h-11 w-full items-center justify-between rounded-lg border px-3 py-1.5 text-sm",
              "transition-all duration-200 appearance-none shadow-theme-xs",
              "text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30",
              "focus:outline-hidden",
            ];

            if (isDisabled) {
              base.push(
                "bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70 border-gray-300 dark:border-gray-700"
              );
            } else if (hasError) {
              base.push(
                "border-error-500 text-error-800 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500"
              );
            } else if (success) {
              base.push(
                "border-success-400 text-success-500 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500"
              );
            } else {
              base.push(
                "bg-transparent border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              );
            }

            if (isFocused) {
              if (hasError) {
                base.push("ring-3 ring-error-500/10");
              } else if (success) {
                base.push("ring-success-500/10");
              } else {
                base.push("ring-3 ring-brand-500/10");
              }
            }

            return base.join(" ");
          },

          valueContainer: () => "flex-1 truncate",
          placeholder: () =>
            "text-gray-400 dark:text-white/30 text-sm select-none",
          input: () => "text-gray-800 dark:text-white/90",
          singleValue: () => "text-gray-800 dark:text-white/90",
          indicatorsContainer: () =>
            "flex items-center pr-2 text-gray-400 dark:text-gray-500",
          dropdownIndicator: ({ isFocused }) =>
            `transition-colors ${
              isFocused ? "text-brand-500" : "hover:text-gray-500"
            }`,
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
      />

      {/* Error message */}
      {typeof error === "string" && error && (
        <p className="mt-1.5 text-xs text-error-500">{error}</p>
      )}
    </div>
  );
};

export default ReactSelect;
