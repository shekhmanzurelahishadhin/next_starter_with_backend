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

export default function Roles() {
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
    exportAllRoles,
  } = useRoles();

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
    document.title = "Permission Management | Inventory Management System";
  }, []);

  return (
    <AccessRoute requiredPermissions={["permission.view", "permission.create", "permission.update", "permission.delete"]}>
      <div>
        <PageBreadcrumb pageTitle="Permission Management" />
        <div className="space-y-6">
          <ComponentCard
            title="Permission Management"
            desc="Manage user permission in the system"
            showAddButton={hasPermission("permission.create")}
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
              exportAllData={exportAllRoles} // Provide exportAllRoles function
              showExportAllOption={false} // Disable "Export All" option
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