"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { LookupForm } from "./LookupForm";
import { LookupDetailView } from "./LookupDetailView";
import { Lookup } from "@/services/lookupService";

interface LookupModalProps {
  isOpen: boolean;
  status: { value: number; label: string }[];
  lookup: Lookup | null;
  loadingCategories: boolean;
  mode: 'view' | 'edit' | 'create';
  saving: boolean;
  onClose: () => void;
  onSave: (categoryData: { name: string }) => void;
  backendErrors?: Record<string, string>; // Add this prop
  formatDate: (dateString?: string) => string;
}

export function LookupModal({
  isOpen,
  status,
  lookup,
  mode,
  saving,
  onClose,
  onSave,
  backendErrors, // Add this prop
  formatDate,
}: LookupModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'view': return 'Lookup Details';
      case 'edit': return 'Edit Lookup';
      case 'create': return 'Add New Lookup';
      default: return 'Lookup';
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

        {mode === 'view' && lookup && (
          <LookupDetailView lookup={lookup} formatDate={formatDate} />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <LookupForm
          status={status}
            lookup={mode === 'edit' ? lookup : null}
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