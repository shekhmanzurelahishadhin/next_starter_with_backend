"use client";
import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface ReactSelectProps {
  label?: string;
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
}

const ReactSelect: React.FC<ReactSelectProps> = ({
  label,
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
}) => {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected: SingleValue<Option>) => {
    onChange(selected ? selected.value : null);
  };

  // 🎨 React Select style configuration matching your theme input
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      height: "42px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "rgb(147 197 253)" : "rgb(209 213 219)", // border-gray-300 → focus:border-brand-300
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(59, 130, 246, 0.2)" // focus:ring-brand-500/10
        : "none",
      backgroundColor: "var(--color-bg)",
      color: "var(--color-text, #111827)",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      fontSize: "0.875rem",
      appearance: "none",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: "rgb(147 197 253)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "rgb(17 24 39)", // text-gray-800
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgb(156 163 175)", // text-gray-400
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "rgb(156 163 175)",
      paddingRight: "0.5rem",
      transition: "color 0.2s",
      "&:hover": { color: "rgb(107 114 128)" },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      marginTop: 4,
      backgroundColor: "white",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgb(59 130 246 / 0.1)" // brand-100
        : state.isFocused
        ? "rgb(243 244 246)" // gray-100
        : "transparent",
      color: state.isSelected ? "rgb(37 99 235)" : "rgb(31 41 55)",
      cursor: "pointer",
      fontSize: "0.875rem",
    }),
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Select
        className="theme-react-select"
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
        styles={customStyles}
      />
    </div>
  );
};

export default ReactSelect;
