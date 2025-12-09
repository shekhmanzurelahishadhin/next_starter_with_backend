"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { PermissionForm } from "./PermissionForm";
import { PermissionDetailView } from "./PermissionDetailView";
import { Permission } from "@/services/permissionService";

interface PermissionModalProps {
  isOpen: boolean;
  permission: Permission | null;
  mode: 'view' | 'edit' | 'create';
  saving: boolean;
  onClose: () => void;
  onSave: (permissionData: { name: string }) => void;
  backendErrors?: Record<string, string>; // Add this prop
}

export function PermissionModal({
  isOpen,
  permission,
  mode,
  saving,
  onClose,
  onSave,
  backendErrors, // Add this prop
}: PermissionModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'view': return 'Permission Details';
      case 'edit': return 'Edit Permission';
      case 'create': return 'Add New Permission';
      default: return 'Permission';
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

        {mode === 'view' && permission && (
          <PermissionDetailView permission={permission} />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <PermissionForm
            permission={mode === 'edit' ? permission : null}
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
                form="permission-form"
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