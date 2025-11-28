"use client";
import { useState, useEffect, useCallback } from "react";
import { useModal } from "@/hooks/useModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useAlert } from '@/hooks/useAlert';
import AccessRoute from "@/routes/AccessRoute";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { DataTable } from "@/components/tables/DataTable";
import { RoleModal } from "./components/RoleModal";
import { useRoleColumns } from "./components/RoleColumns";
import { roleService, Role, RoleFilters, PaginatedResponse } from "@/services/roleService";
import { useDebounce } from "@/hooks/useDebounce";

export default function RolesPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const { hasPermission } = useAuth();
  const { confirm } = useAlert();

  // State management
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('create');
  
  // Filter and pagination state
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  
  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Load roles
  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters: RoleFilters = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
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
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, filters]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // Role actions
  const handleView = useCallback((role: Role) => {
    setSelectedRole(role);
    setMode('view');
    openModal();
  }, [openModal]);

  const handleEdit = useCallback((role: Role) => {
    setSelectedRole(role);
    setMode('edit');
    openModal();
  }, [openModal]);

  const handleDelete = useCallback(async (id: number) => {
    const result = await confirm({
      title: 'Delete Role?',
      text: 'Are you sure you want to delete this role? This action cannot be undone.',
    });

    if (!result.isConfirmed) return;
    let previousRoles: Role[] = [];
    try {
      // Optimistic update
      const previousRoles = [...roles];
      setRoles(prev => prev.filter(role => role.id !== id));
      
      await roleService.deleteRole(id);
      toast.success('Role deleted successfully!');
      await loadRoles();
    } catch (err) {
      // Revert on error
      setRoles(previousRoles);
      toast.error('Failed to delete role');
    }
  }, [confirm, roles, loadRoles]);

  const handleAddNew = useCallback(() => {
    setSelectedRole(null);
    setMode('create');
    openModal();
  }, [openModal]);

  const handleSave = async (roleData: { name: string; guard_name?: string }) => {
    try {
      setSaving(true);

      if (mode === 'edit' && selectedRole) {
        await roleService.updateRole(selectedRole.id, roleData);
        toast.success('Role updated successfully!');
      } else {
        await roleService.createRole(roleData);
        toast.success('Role created successfully!');
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
      }

      closeModal();
      resetForm();
      await loadRoles();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  // Filter and search handlers
  const handleFilterChange = useCallback((name: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const resetForm = useCallback(() => {
    setSelectedRole(null);
    setMode('create');
  }, []);

  const handleModalClose = useCallback(() => {
    closeModal();
    resetForm();
  }, [closeModal, resetForm]);

  // Memoized columns
  const columns = useRoleColumns({
    hasPermission,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  return (
    <AccessRoute requiredPermissions={["role.view", "role.create", "role.update", "role.delete"]}>
      <div>
        <PageBreadcrumb pageTitle="Roles Management" />
        <div className="space-y-6">
          <ComponentCard
            title="Roles Management"
            desc="Manage user roles in the system"
            showAddButton={hasPermission("role.create")}
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

          {/* Single Modal for all modes */}
          <RoleModal
            isOpen={isOpen}
            role={selectedRole}
            mode={mode}
            saving={saving}
            onClose={handleModalClose}
            onSave={handleSave}
          />
        </div>
      </div>
    </AccessRoute>
  );
}