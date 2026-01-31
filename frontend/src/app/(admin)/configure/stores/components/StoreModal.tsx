"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { StoreForm } from "./StoreForm";
import { StoreDetailView } from "./StoreDetailView";
import { Store } from "@/services/storeService";

interface StoreModalProps {
  isOpen: boolean;
  status: { value: number; label: string }[];
  store: Store | null;
  categories: { value: number; label: string }[];
  loadingCategories: boolean;
  mode: 'view' | 'edit' | 'create';
  saving: boolean;
  onClose: () => void;
  onSave: (categoryData: { name: string }) => void;
  backendErrors?: Record<string, string>; // Add this prop
  formatDate: (dateString?: string) => string;
}

export function StoreModal({
  isOpen,
  status,
  store,
  categories,
  loadingCategories,
  mode,
  saving,
  onClose,
  onSave,
  backendErrors, // Add this prop
  formatDate,
}: StoreModalProps) {
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

        {mode === 'view' && store && (
          <StoreDetailView store={store} formatDate={formatDate} />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <StoreForm
          status={status}
            store={mode === 'edit' ? store : null}
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
                form="store-form"
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