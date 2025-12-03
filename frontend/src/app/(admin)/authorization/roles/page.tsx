"use client";
import { useAuth } from "@/context/AuthContext";
import { useRoles } from "./hooks/useRoles";
import AccessRoute from "@/routes/AccessRoute";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { DataTable } from "@/components/tables/DataTable";
import { RoleModal } from "./components/RoleModal";
import { useRoleColumns } from "./components/RoleColumns";
import { useEffect } from "react";
import { roleService } from "@/services/roleService";

export default function RolesPage() {
  const { hasPermission } = useAuth();

  // Single hook for all role operations
  const {
    roles,
    loading,
    saving,
    isOpen,
    selectedRole,
    mode,
    backendErrors,
    pagination,
    total,
    setPagination,
    handleView,
    handleEdit,
    handleCreate,
    handleCloseModal,
    handleDelete,
    handleSave,
    handleFilterChange,
    handleSearch,
    // loadRoles,
  } = useRoles();
  // Function to export all roles
  const exportAllRoles = async () => {
    try {
      // Call API without pagination to get all data
      const response = await roleService.getRoles({});
      return response.data;
    } catch (error) {
      console.error('Error exporting all roles:', error);
      throw error;
    }
  };
  // Memoized columns
  const columns = useRoleColumns({
    hasPermission,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  useEffect(() => {
    document.title = "Roles Management | Inventory Management System";
  }, []);

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
            openModal={handleCreate}
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
              exportFilename="roles"
              exportAllData={exportAllRoles}
              showExportAllOption={false}
            />
          </ComponentCard>

          <RoleModal
            isOpen={isOpen}
            role={selectedRole}
            mode={mode}
            saving={saving}
            onClose={handleCloseModal}
            onSave={handleSave}
            backendErrors={backendErrors}
          />
        </div>
      </div>
    </AccessRoute>
  );
}