"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { UserForm } from "./UserForm";
import { UserDetailView } from "./UserDetailView";
import { User } from "@/services/userService";
interface UserFormData {
  name: string;
  email: string | null;
  password: string | null;
  password_confirmation: string | null;
  roles: number[] | null;
  company_id: number | null;
}
interface UserModalProps {
  isOpen: boolean;
  user: User | null;
  mode: 'view' | 'edit' | 'create';
  saving: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  backendErrors?: Record<string, string>;

  companies: { value: number; label: string }[];
  roles: { value: number; label: string }[];
  loadingCompanies: boolean;
  loadingRoles: boolean;
  formatDate: (dateString?: string) => string;
}

export function UserModal({
  isOpen,
  user,
  mode,
  saving,
  onClose,
  onSave,
  backendErrors, 

  companies,
  roles,
  loadingCompanies,
  loadingRoles,
  formatDate,
}: UserModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'view': return 'User Details';
      case 'edit': return 'Edit User';
      case 'create': return 'Add New User';
      default: return 'User';
    }
  };

  const getModalSize = () => {
    return mode === 'view' ? 'max-w-2xl' : 'max-w-xl';
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

        {mode === 'view' && user && (
          <UserDetailView 
          user={user} 
          formatDate={formatDate}
           />
        )}

        {(mode === 'create' || mode === 'edit') && (
          <UserForm
            user={mode === 'edit' ? user : null}
            mode={mode}
            saving={saving}
            onSubmit={onSave}
            backendErrors={backendErrors} // backend errors to form

            companies={companies}
            roles={roles}
            loadingCompanies={loadingCompanies}
            loadingRoles={loadingRoles}
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
                form="user-form"
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