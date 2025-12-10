// hooks/usePermissions.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { permissionService, Permission, PermissionFilters, PaginatedResponse } from '@/services/permissionService';
import { useAlert } from '@/hooks/useAlert';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';

export const usePermissions = () => {
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

  const [modules, setModules] = useState<{ value: number; label: string }[]>([]);
  
  // Filter and pagination state
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const debouncedFilters = useDebounce(filters, 300);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });
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
      console.error('Error loading permissions:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, debouncedFilters]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Modal operations
  const handleView = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setMode('view');
    setBackendErrors({});
    openModal();
  }, [openModal]);

  const handleEdit = useCallback((permission: Permission) => {
    setSelectedPermission(permission);
    setMode('edit');
    setBackendErrors({});
    openModal();
  }, [openModal]);

  const handleCreate = useCallback(() => {
    setSelectedPermission(null);
    setMode('create');
    setBackendErrors({});
    openModal();
  }, [openModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setSelectedPermission(null);
    setMode('create');
    setBackendErrors({});
  }, [closeModal]);

  // CRUD operations
  const handleDelete = useCallback(async (id: number) => {
    const result = await confirm({
      title: 'Delete Permission?',
      text: 'Are you sure you want to delete this permission? This action cannot be undone.',
    });

    if (!result.isConfirmed) return;

    let previousPermissions: Permission[] = [];
    try {
      // Optimistic update
      previousPermissions = [...permissions];
      setPermissions(prev => prev.filter(permission => permission.id !== id));
      
      await permissionService.deletePermission(id);
      toast.success('Permission deleted successfully!');
      await loadPermissions();
    } catch (err) {
      // Revert on error
      setPermissions(previousPermissions);
      toast.error('Failed to delete permission');
    }
  }, [confirm, permissions, loadPermissions]);

  const handleSave = useCallback(async (permissionData: { name: string }) => {
    try {
      setSaving(true);
      setBackendErrors({});

      if (mode === 'edit' && selectedPermission) {
        await permissionService.updatePermission(selectedPermission.id, permissionData);
        toast.success('Permission updated successfully!');
      } else {
        await permissionService.createPermission(permissionData);
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
  }, [mode, selectedPermission, loadPermissions, handleCloseModal]);

  // Filter and search operations
  const handleFilterChange = useCallback((name: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  // Utility functions
  const clearBackendErrors = useCallback(() => {
    setBackendErrors({});
  }, []);

  const resetToFirstPage = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

    // Function to export all permissions
    const exportAllPermissions = async () => {
      try {
        // Call API without pagination to get all data
        const response = await permissionService.getPermissions({});
        return response.data;
      } catch (error) {
        console.error('Error exporting all permissions:', error);
        throw error;
      }
    };

    // Fetch modules
  const fetchModules = async () => {
    const res = await api.get("/modules");
    setModules(res.data.map((m: any) => ({ value: m.id, label: m.name })));
  };
  useEffect(() => {
    fetchModules();
  }, []);

  return {
    // State
    permissions,
    loading,
    saving,
    isOpen,
    selectedPermission,
    mode,
    backendErrors,
    pagination,
    total,
    
    // Actions
    setPagination,
    handleView,
    handleEdit,
    handleCreate,
    handleCloseModal,
    handleDelete,
    handleSave,
    handleFilterChange,
    handleSearch,
    clearBackendErrors,
    resetToFirstPage,
    loadPermissions,
    exportAllPermissions,
    // moudle options
    modules,
  };
};