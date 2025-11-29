"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { RoleForm } from "./RoleForm";
import { RoleDetailView } from "./RoleDetailView";
import { Role } from "@/services/roleService";

interface RoleModalProps {
  isOpen: boolean;
  role: Role | null;
  mode: 'view' | 'edit' | 'create';
  saving: boolean;
  onClose: () => void;
  onSave: (roleData: { name: string}) => void;
}

export function RoleModal({
  isOpen,
  role,
  mode,
  saving,
  onClose,
  onSave,
}: RoleModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'view': return 'Role Details';
      case 'edit': return 'Edit Role';
      case 'create': return 'Add New Role';
      default: return 'Role';
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

        {/* Content based on mode */}
        {mode === 'view' && role && (
          <RoleDetailView role={role} />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <RoleForm
            role={mode === 'edit' ? role : null}
            mode={mode}
            saving={saving}
            onSubmit={onSave}
          />
        )}

        {/* Footer buttons */}
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
                form="role-form"
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