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
import { FiEye, FiEdit, FiTrash, FiShield, } from "@/icons/index";
import ActionButtons from "@/components/ui/button/ActionButton";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { roleService, Role, RoleFilters, PaginatedResponse } from "@/services/roleService";
import { toast } from "react-toastify";
import { useAlert } from '@/hooks/useAlert';
import RoleDetailView from "./RoleDetailView";

// Extend ColumnMeta to include custom export properties
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    filterVariant?: 'text' | 'select' | 'none';
    filterOptions?: { value: string; label: string }[];
    exportable?: boolean;
    exportHeader?: string;
    exportValue?: (row: TData, index?: number) => string | number;
    widthClass?: string;
  }
}

// Create columns inside the component to access hooks
const createColumns = (
  hasPermission: (permission: string) => boolean,
  handleView: (role: Role) => void,
  handleEdit: (role: Role) => void,
  handleDelete: (id: number) => void,
  pageIndex: number,
  pageSize: number
): ColumnDef<Role>[] => [
    {
      id: "sl",
      header: "SL",
      enableSorting: false,
      meta: {
        filterVariant: "none",
        exportable: true,
        exportHeader: "SL",
        exportValue: (row, index) => (pageIndex * pageSize) + (index ?? 0) + 1,
        widthClass: "w-[30px]" // CSS width class only
      },
      cell: ({ row }) => {
        const serialNumber = (pageIndex * pageSize) + row.index + 1;
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {serialNumber}
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
        exportable: true,
        exportHeader: "Role Name",
        exportValue: (row) => row.name,
        widthClass: "w-[200px]" // CSS width class only
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
        filterOptions: [
          { value: "web", label: "Web" },
          { value: "api", label: "API" },
          { value: "sanctum", label: "Sanctum" },
        ],
        exportable: true,
        exportHeader: "Guard Name",
        exportValue: (row) => row.guard_name,
        widthClass: "w-[150px]" // CSS width class only
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
      meta: {
        exportable: true,
        exportHeader: "Created At",
        exportValue: (row) => {
          if (!row.created_at) return "-";
          const [datePart] = row.created_at.split(" ");
          const [y, m, d] = datePart.split("-");
          return `${d}-${m}-${y}`;
        },
        widthClass: "w-[120px]" // CSS width class only
      },
      cell: ({ row }) => {
        const value = row.getValue("created_at");
        if (!value) {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
        }
        const [datePart] = (value as string).split(" ");
        const [y, m, d] = datePart.split("-");
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {`${d}-${m}-${y}`}
          </span>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      enableSorting: true,
      meta: {
        exportable: true,
        exportHeader: "Updated At",
        exportValue: (row) => {
          if (!row.updated_at) return "-";
          const [datePart] = row.updated_at.split(" ");
          const [y, m, d] = datePart.split("-");
          return `${d}-${m}-${y}`;
        },
        widthClass: "w-[120px]" // CSS width class only
      },
      cell: ({ row }) => {
        const value = row.getValue("updated_at");
        if (!value) {
          return <span className="text-gray-400 dark:text-gray-500">-</span>;
        }
        const [datePart] = (value as string).split(" ");
        const [y, m, d] = datePart.split("-");
        return (
          <span className="text-gray-600 dark:text-gray-400">
            {`${d}-${m}-${y}`}
          </span>
        );
      },
    },
    {
      id: "Actions",
      header: () => <div className="">Actions</div>,
      enableSorting: false,
      meta: {
        filterVariant: "none",
        exportable: false,
        widthClass: "w-[150px]" // CSS width class only
      },
      cell: ({ row }) => {
        const role = row.original;
        return (
          <ActionButtons
            row={role}
            buttons={[
              {
                icon: FiEye,
                onClick: (row) => handleView(row as Role),
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


export default function Roles() {
  const { isOpen, openModal, closeModal } = useModal();
  const { hasPermission } = useAuth();
  const { confirm } = useAlert();

  // State for data and loading
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | number>>({});

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  // Fetch data with pagination and filters
  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);

      const apiFilters: RoleFilters = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        ...(search && { search }),
        ...filters,
      };

      const response: PaginatedResponse<Role> = await roleService.getRoles(apiFilters);
      setRoles(response.data);
      setTotal(response.total);
    } catch (err) {
      toast.error('Failed to load roles');
      console.error('Error loading roles:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, search, filters]);

  // Load roles when pagination or search changes
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setIsViewMode(true);
    setIsEditMode(false);
    openModal();
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditMode(true);
    setIsViewMode(false);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const result = await confirm({
      title: 'Delete Role?',
      text: 'Are you sure you want to delete this role? This action cannot be undone.',
    });

    if (!result.isConfirmed) return;

    try {
      await roleService.deleteRole(id);
      // Success toast
      toast.success('Role deleted successfully!');
      await loadRoles();
    } catch (err) {
      console.error('Error deleting role:', err);

      // Error toast
      toast.error('Failed to delete role');
    }
  };

  const handleAddNew = () => {
    setSelectedRole(null);
    setIsEditMode(false);
    setIsViewMode(false);
    openModal();
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const roleData = {
      name: formData.get('name') as string,
      guard_name: formData.get('guard_name') as string || 'web',
    };

    try {
      setSaving(true);

      if (isEditMode && selectedRole) {
        // Update existing role
        await roleService.updateRole(selectedRole.id, roleData);
        toast.success('Role updated successfully!');
        // Reload data to reflect changes
        await loadRoles();
      } else {
        // Create new role
        await roleService.createRole(roleData);
        toast.success('Role created successfully!');
        // Reset to first page when creating
        if (pagination.pageIndex == 0) {
          await loadRoles();
        }
        else {
          setPagination(prev => ({ ...prev, pageIndex: 0 }));
        }
      }

      closeModal();
      resetForm();
    } catch (err: any) {
      console.error('Error saving role:', err);
      toast.error(err?.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  // Handle column filter changes  
  const handleFilterChange = (name: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const resetForm = () => {
    setSelectedRole(null);
    setIsEditMode(false);
    setIsViewMode(false);
  };

  // Handle search with debounce
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Create columns with the required functions
  const columns = createColumns(
    hasPermission,
    handleView,
    handleEdit,
    handleDelete,
    pagination.pageIndex,
    pagination.pageSize
  );

  return (
    <AccessRoute requiredPermissions={["role.view"]}>
      <div>
        <PageBreadcrumb pageTitle="Roles Management" />
        <div className="space-y-6">
          <ComponentCard
            title="Roles Management"
            desc="Manage user roles in the system"
            showAddButton={hasPermission("role.create")} // Show add button based on permission
            buttonLabel="Add New"
            openModal={handleAddNew}
          >
            <DataTable
              columns={columns}
              data={roles}
              searchKey="name"
              onSearchChange={handleSearch}
              pagination={pagination}
              onPaginationChange={setPagination}
              onColumnFilterChange={handleFilterChange}
              total={total}
              loading={loading}
            />
          </ComponentCard>

          {/* Add/Edit Role Modal */}
          <Modal
            isOpen={isOpen && (isEditMode || !isViewMode)}
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
                  {saving ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </Modal>

          {/* View Role Modal */}
          <Modal
            isOpen={isOpen && isViewMode}
            onClose={() => {
              closeModal();
              resetForm();
            }}
            className="max-w-2xl p-5 lg:p-5"
          >
            <div>
              <h4 className="flex items-center gap-2 mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                Role Details
              </h4>

              {selectedRole && <RoleDetailView role={selectedRole} />}

              <div className="flex items-center justify-end w-full gap-3 mt-6">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    closeModal();
                    resetForm();
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </AccessRoute>
  );
}