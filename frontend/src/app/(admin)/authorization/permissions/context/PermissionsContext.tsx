// context/PermissionsContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";
import { permissionService, Permission, PermissionFilters, PaginatedResponse } from "@/services/permissionService";
import { useAlert } from "@/hooks/useAlert";
import { useModal } from "@/hooks/useModal";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";

interface PermissionsContextType {
  permissions: Permission[];
  loading: boolean;
  saving: boolean;
  isOpen: boolean;
  selectedPermission: Permission | null;
  mode: 'view' | 'edit' | 'create';
  backendErrors: Record<string, string>;
  pagination: { pageIndex: number; pageSize: number };
  total: number;
  modules: { value: number; label: string }[];
  menus: { value: number; label: string }[];
  submenus: { value: number; label: string }[];
  loadingModules: boolean;
  loadingMenus: boolean;
  loadingSubmenus: boolean;

  // Actions
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  handleView: (permission: Permission) => void;
  handleEdit: (permission: Permission) => void;
  handleCreate: () => void;
  handleCloseModal: () => void;
  handleDelete: (id: number) => void;
  handleSave: (permissionData: { name: string; module_id: number | null; menu_id: number | null; submenu_id: number | null }) => Promise<boolean>;
  handleFilterChange: (name: string, value: string | number) => void;
  handleSearch: (value: string) => void;
  exportAllPermissions: () => Promise<Permission[]>;
  fetchMenus: (moduleId: number | null) => void;
  fetchSubmenus: (menuId: number | null) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { confirm } = useAlert();
  const { isOpen, openModal, closeModal } = useModal();

  // Data state
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('create');
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});

  // Dropdown data
  const [modules, setModules] = useState<{ value: number; label: string }[]>([]);
  const [menus, setMenus] = useState<{ value: number; label: string }[]>([]);
  const [submenus, setSubmenus] = useState<{ value: number; label: string }[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [loadingSubmenus, setLoadingSubmenus] = useState(false);

  // Filter and pagination state
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const debouncedFilters = useDebounce(filters, 300);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 30 });
  const [total, setTotal] = useState(0);

  // Search state
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Load permissions
  const loadPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters: PermissionFilters = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...debouncedFilters,
      };
      const response: PaginatedResponse<Permission> = await permissionService.getPermissions(apiFilters);
      setPermissions(response.data);
      setTotal(response.total);
    } catch (err) {
      toast.error('Failed to load permissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, debouncedFilters]);

  // Fetch modules
  const fetchModules = useCallback(async () => {
    if (modules.length > 0) return;
    try {
      setLoadingModules(true);
      const res = await api.get("/modules");
      setModules(res.data.map((m: any) => ({ value: m.id, label: m.name })));
    } catch (err) {
      toast.error("Failed to load modules");
      console.error(err);
    } finally {
      setLoadingModules(false);
    }
  }, [modules.length]);

  // Fetch menus
  const fetchMenus = useCallback(async (moduleId: number | null) => {
    if (!moduleId) {
      setMenus([]);
      setSubmenus([]);
      return;
    }
    try {
      setLoadingMenus(true);
      const res = await api.get(`/menus?module_id=${moduleId}`);
      setMenus(res.data.map((m: any) => ({ value: m.id, label: m.name })));
      setSubmenus([]);
    } catch (err) {
      toast.error("Failed to load menus");
      console.error(err);
    } finally {
      setLoadingMenus(false);
    }
  }, []);

  // Fetch submenus
  const fetchSubmenus = useCallback(async (menuId: number | null) => {
    if (!menuId) {
      setSubmenus([]);
      return;
    }
    try {
      setLoadingSubmenus(true);
      const res = await api.get(`/sub-menus?menu_id=${menuId}`);
      setSubmenus(res.data.map((s: any) => ({ value: s.id, label: s.name })));
    } catch (err) {
      toast.error("Failed to load submenus");
      console.error(err);
    } finally {
      setLoadingSubmenus(false);
    }
  }, []);

  // Modal handlers
  const handleView = useCallback(async (permission: Permission) => {
    setSelectedPermission(permission);
    setMode('view');
    setBackendErrors({});
    if (permission.module_id) await fetchMenus(permission.module_id);
    if (permission.menu_id) await fetchSubmenus(permission.menu_id);
    openModal();
  }, [fetchMenus, fetchSubmenus, openModal]);

  const handleEdit = useCallback(async (permission: Permission) => {
    setSelectedPermission(permission);
    setMode('edit');
    setBackendErrors({});
    if (permission.module_id) await fetchMenus(permission.module_id);
    if (permission.menu_id) await fetchSubmenus(permission.menu_id);
    openModal();
  }, [fetchMenus, fetchSubmenus, openModal]);

  const handleCreate = useCallback(() => {
    setSelectedPermission(null);
    setMode('create');
    setBackendErrors({});
    setMenus([]);
    setSubmenus([]);
    openModal();
  }, [openModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setSelectedPermission(null);
    setMode('create');
    setBackendErrors({});
    setMenus([]);
    setSubmenus([]);
  }, [closeModal]);

  // CRUD operations
  const handleDelete = useCallback(async (id: number) => {
    const result = await confirm({
      title: 'Delete Permission?',
      text: 'Are you sure you want to delete this permission? This action cannot be undone.',
    });
    if (!result.isConfirmed) return;

    const prevPermissions = [...permissions];
    try {
      setPermissions(prev => prev.filter(p => p.id !== id));
      await permissionService.deletePermission(id);
      toast.success('Permission deleted successfully');
      await loadPermissions();
    } catch (err) {
      setPermissions(prevPermissions);
      toast.error('Failed to delete permission');
    }
  }, [confirm, permissions, loadPermissions]);

  const handleSave = useCallback(async (data: { name: string; module_id: number | null; menu_id: number | null; submenu_id: number | null }) => {
    try {
      setSaving(true);
      setBackendErrors({});
      if (mode === 'edit' && selectedPermission) {
        await permissionService.updatePermission(selectedPermission.id, data);
        toast.success('Permission updated successfully!');
      } else {
        await permissionService.createPermission(data);
        toast.success('Permission created successfully!');
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
      }
      handleCloseModal();
      await loadPermissions();
      return true;
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        const errors: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([field, messages]) => {
          errors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setBackendErrors(errors);
      } else {
        toast.error(err?.response?.data?.message || 'Failed to save permission');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [mode, selectedPermission, handleCloseModal, loadPermissions]);

  // Filters & search
  const handleFilterChange = useCallback((name: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  // Export all
  const exportAllPermissions = useCallback(async () => {
    try {
      const response = await permissionService.getPermissions({});
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchModules();
    loadPermissions();
  }, [fetchModules, loadPermissions]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        loading,
        saving,
        isOpen,
        selectedPermission,
        mode,
        backendErrors,
        pagination,
        total,
        modules,
        menus,
        submenus,
        loadingModules,
        loadingMenus,
        loadingSubmenus,
        setPagination,
        handleView,
        handleEdit,
        handleCreate,
        handleCloseModal,
        handleDelete,
        handleSave,
        handleFilterChange,
        handleSearch,
        exportAllPermissions,
        fetchMenus,
        fetchSubmenus,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (!context) throw new Error("usePermissionsContext must be used within PermissionsProvider");
  return context;
};
