import React from "react";
import Button from "../ui/button/Button";
import { FiPlus } from "../../icons/index";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  showAddButton?: boolean;
  openModal?: () => void;
  buttonLabel?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  showAddButton = false,
  openModal,
  buttonLabel = "Add New",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="px-0 sm:px-6 pt-6 sm:py-5">
          <h3 className="text-base text-center sm:text-left font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>

          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        <div className="px-0 sm:px-6 pb-6 sm:py-5">
          {showAddButton && (
            <Button size="sm" onClick={openModal}>
              <FiPlus /> {buttonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
