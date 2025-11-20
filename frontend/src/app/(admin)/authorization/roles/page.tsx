"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import AccessRoute from "@/routes/AccessRoute";
import { FiEye, FiEdit, FiTrash, FiRefreshCw, FiShield } from "@/icons/index";
import ActionButtons from "@/components/ui/button/ActionButton";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { roleService, Role } from "@/services/roleService";

// Create columns inside the component to access hooks
const createColumns = (
  hasPermission: (permission: string) => boolean,
  handleEdit: (role: Role) => void,
  handleDelete: (id: number) => void
): ColumnDef<Role>[] => [
    {
      id: "sl",
      header: "SL",
      enableSorting: false,
      meta: {
        filterVariant: "none",
      },
      cell: ({ row }) => {
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {row.index + 1}
          </span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Role Name",
      enableSorting: true,
      meta: {
        filterVariant: "text",
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <FiShield className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-800 dark:text-white/90">
              {row.getValue("name")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "guard_name",
      header: "Guard Name",
      enableSorting: true,
      meta: {
        filterVariant: "select",
      },
      cell: ({ row }) => {
        const guardName = row.getValue("guard_name") as string;
        return (
          <Badge
            size="sm"
            color={
              guardName === "web"
                ? "primary"
                : guardName === "api"
                  ? "success"
                  : "warning"
            }
            variant="light"
          >
            {guardName}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at");

        if (!createdAt) {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
        }

        const date = new Date(createdAt as string);
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {isNaN(date.getTime()) ? '-' : date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      enableSorting: true,
      cell: ({ row }) => {
        const updatedAt = row.getValue("updated_at");

        if (!updatedAt) {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
        }

        const date = new Date(updatedAt as string);
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {isNaN(date.getTime()) ? '-' : date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "Actions",
      header: () => <div className="text-center">Actions</div>,
      enableSorting: false,
      meta: {
        filterVariant: "none",
      },
      cell: ({ row }) => {
        const role = row.original;

        return (
          <ActionButtons
            row={role}
            buttons={[
              {
                icon: FiEye,
                onClick: (row) => console.log('View role:', row),
                variant: "success",
                size: "sm",
                tooltip: "View",
                show: () => hasPermission("role.view"),
              },
              {
                icon: FiEdit,
                onClick: (row) => handleEdit(row as Role),
                variant: "primary",
                size: "sm",
                tooltip: "Edit",
                show: () => hasPermission("role.edit"),
              },
              {
                icon: FiTrash,
                onClick: (row) => handleDelete((row as Role).id),
                variant: "danger",
                size: "sm",
                tooltip: "Delete",
                show: () => hasPermission("role.delete"),
              },
            ]}
          />
        );
      },
    },
  ];
export default function RolesDataTable() {
  const { isOpen, openModal, closeModal } = useModal();
  const { hasPermission } = useAuth();

  // State for data and loading
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err) {
      setError('Failed to load roles');
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditMode(true);
    openModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleService.deleteRole(id);
        // Remove from local state
        setRoles(prev => prev.filter(role => role.id !== id));
      } catch (err) {
        console.error('Error deleting role:', err);
        alert('Failed to delete role');
      }
    }
  };

  const handleAddNew = () => {
    setSelectedRole(null);
    setIsEditMode(false);
    openModal();
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const roleData = {
      name: formData.get('name') as string,
      // guard_name: formData.get('guard_name') as string,
    };

    try {
      setSaving(true);

      if (isEditMode && selectedRole) {
        // Update existing role
        const updatedRole = await roleService.updateRole(selectedRole.id, roleData);
        setRoles(prev => prev.map(role =>
          role.id === selectedRole.id ? updatedRole : role
        ));
      } else {
        // Create new role
        const newRole = await roleService.createRole(roleData);
        setRoles(prev => [newRole, ...prev]);
      }

      closeModal();
      resetForm();
    } catch (err) {
      console.error('Error saving role:', err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} role`);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setIsEditMode(false);
  };

  // Create columns with the required functions
  const columns = createColumns(hasPermission, handleEdit, handleDelete);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading roles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
        <Button onClick={loadRoles} className="mt-4">
          <FiRefreshCw className="mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <AccessRoute requiredPermissions={["role.view"]}>
      <div>
        <PageBreadcrumb pageTitle="Roles Management" />
        <div className="space-y-6">
          <ComponentCard
            title="Roles Management"
            desc="Manage user roles in the system"
            showAddButton={hasPermission("role.create")}
            buttonLabel="Add New Role"
            openModal={handleAddNew}
          // showRefreshButton={true}
          // onRefresh={loadRoles}
          // isLoading={loading}
          >
            <DataTable
              columns={columns}
              data={roles}
              searchKey="name"
            />
          </ComponentCard>

          {/* Add/Edit Role Modal */}
          <Modal
            isOpen={isOpen}
            onClose={() => {
              closeModal();
              resetForm();
            }}
            className="max-w-md p-5 lg:p-5"
          >
            <form onSubmit={handleSave}>
              <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                {isEditMode ? 'Edit Role' : 'Add New Role'}
              </h4>

              <div className="space-y-5">
                <div>
                  <Label>Role Name *</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="admin, user, manager, etc."
                    defaultValue={selectedRole?.name || ''}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end w-full gap-3 mt-6">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    closeModal();
                    resetForm();
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (isEditMode ? 'Update Role' : 'Create Role')}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </AccessRoute>
  );
}