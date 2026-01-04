"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { SubCategoryForm } from "./SubCategoryForm";
import { SubCategoryDetailView } from "./SubCategoryDetailView";
import { SubCategory } from "@/services/subCategoryService";

interface SubCategoryModalProps {
  isOpen: boolean;
  status: { value: number; label: string }[];
  subCategory: SubCategory | null;
  categories: { value: number; label: string }[];
  loadingCategories: boolean;
  mode: 'view' | 'edit' | 'create';
  saving: boolean;
  onClose: () => void;
  onSave: (categoryData: { name: string, description: string }) => void;
  backendErrors?: Record<string, string>; // Add this prop
  formatDate: (dateString?: string) => string;
}

export function SubCategoryModal({
  isOpen,
  status,
  subCategory,
  categories,
  loadingCategories,
  mode,
  saving,
  onClose,
  onSave,
  backendErrors, // Add this prop
  formatDate,
}: SubCategoryModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'view': return 'Sub-Category Details';
      case 'edit': return 'Edit Sub-Category';
      case 'create': return 'Add New Sub-Category';
      default: return 'Sub-Category';
    }
  };

  const getModalSize = () => {
    return mode === 'view' ? 'max-w-2xl' : 'max-w-md';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`p-5 lg:p-5 ${getModalSize()}`}
    >
      <div>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          {getTitle()}
        </h4>

        {mode === 'view' && subCategory && (
          <SubCategoryDetailView subCategory={subCategory} formatDate={formatDate} />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <SubCategoryForm
          status={status}
            subCategory={mode === 'edit' ? subCategory : null}
            categories={categories}
            loadingCategories={loadingCategories}
            mode={mode}
            saving={saving}
            onSubmit={onSave}
            backendErrors={backendErrors} // backend errors to form
          />
        )}

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          {mode === 'view' ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="sub-category-form"
                size="sm"
                disabled={saving}
              >
                {saving ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create')}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}