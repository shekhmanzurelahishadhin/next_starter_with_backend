// hooks/useRoles.ts
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { storeService, Store, StoreFilters, PaginatedResponse } from '@/services/storeService';
import { lookupService } from '@/services/lookupService';
import { useAlert } from '@/hooks/useAlert';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';
export const useStores = () => {
  const { confirm } = useAlert();
  const { isOpen, openModal, closeModal } = useModal();

  // Data state
  const [categories, setCategories] = useState<{ value: number; label: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ value: number; label: string }[]>([]);

  // Modal state
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('create');
  const [backendErrors, setBackendErrors] = useState<Record<string, string>>({});

  // Filter and pagination state
  const [filters, setFilters] = useState<Record<string, string | number>>({});
  const debouncedFilters = useDebounce(filters, 300);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);

  // Search state

  // Load categories
  const loadStores = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters: StoreFilters = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        ...debouncedFilters,
      };

      const response: PaginatedResponse<Store> = await storeService.getStores(apiFilters);
      setStores(response.data);
      setTotal(response.total);
    } catch (err) {
      toast.error('Failed to load sub categories');
      console.error('Error loading sub categories:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedFilters]);

  const fetchLookups = async () => {
    try {
      const type = "active_status";
      const res = await lookupService.getLookupByType(type);
      setStatus(res);
    } catch (error) {
      console.error("Failed to fetch lookups", error);
    }
  };

  const fetchCategories = async () => {
   
    setLoadingCategories(true);
    try {
      const res = await api.get("/configure/categories", { params: { status: 1, per_page: null, columns: ['id','name'] } });
      setCategories(res.data.data.data.map((cat) => ({ value: Number(cat.id), label: cat.name })));
      setLoadingCategories(false);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setLoadingCategories(false);
    }   
  };

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  // for active status lookup
  useEffect(() => {
    fetchLookups();
  }, []);


  // Modal operations
  const handleView = useCallback((store: Store) => {
    setSelectedStore(store);
    setMode('view');
    setBackendErrors({});
    openModal();
  }, [openModal]);

  const handleEdit = useCallback((store: Store) => {
    setSelectedStore(store);
    setMode('edit');
    setBackendErrors({});
    fetchCategories();
    openModal();
  }, [openModal]);

  const handleCreate = useCallback(() => {
    setSelectedStore(null);
    setMode('create');
    setBackendErrors({});
    fetchCategories();
    openModal();
  }, [openModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    setSelectedStore(null);
    setMode('create');
    setBackendErrors({});
  }, [closeModal]);

  // CRUD operations
  const handleSoftDelete = useCallback(async (id: number) => {
    const result = await confirm({
      title: 'Move to Trash?',
      text: 'Are you sure you want to move this Sub-Category to trash? This action cannot be undone.',
    });

    if (!result.isConfirmed) return;
    let previousStores: Store[] = [];
    try {
      // Optimistic update
      previousStores = [...stores];
      setStores(prev => prev.filter(store => store.id !== id));
      await storeService.softDeleteStore(id);
      toast.success('Sub-Category moved to trashed!');
      await loadStores();
    } catch (err) {
      // Revert on error
      setStores(previousStores);
      toast.error('Failed to delete Sub-Category');
    }
  }, [confirm, stores, loadStores]);

  const handleForceDelete = useCallback(async (id: number) => {
    const result = await confirm({
      title: 'Delete Sub-Category?',
      text: 'Are you sure you want to delete this Sub-Category? This action cannot be undone.',
    });

    if (!result.isConfirmed) return;

    let previousStores: Store[] = [];
    try {
      // Optimistic update
      previousStores = [...stores];
      setStores(prev => prev.filter(store => store.id !== id));
      await storeService.forceDeleteStore(id);
      toast.success('Sub-Category deleted successfully!');
      await loadStores();
    } catch (err) {
      // Revert on error
      setStores(previousStores);
      toast.error('Failed to delete Sub-Category');
    }
  }, [confirm, stores, loadStores]);

  const handleRestore = useCallback(async (id: number) => {
    try {
      await storeService.restoreStore(id);
      toast.success('Sub-Category restored successfully!');
      await loadStores();
    } catch (err) {
      // Revert on error
      toast.error('Failed to restore Sub-Category');
    }
  }, [stores, loadStores]);

  const handleSave = useCallback(async (storeData: { name: string }) => {
    try {
      setSaving(true);
      setBackendErrors({});

      if (mode === 'edit' && selectedStore) {
        await storeService.updateStore(selectedStore.id, storeData);
        toast.success('Sub-Category updated successfully!');
      } else {
        await storeService.createStore(storeData);
        toast.success('Sub-Category created successfully!');
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
      }

      handleCloseModal();
      await loadStores();
      return true;
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        const errors: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([field, messages]) => {
          errors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setBackendErrors(errors);
      } else {
        toast.error(err?.response?.data?.message || 'Failed to save Sub-Category');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [mode, selectedStore, loadStores, handleCloseModal]);

  // Filter and search operations
  const handleFilterChange = useCallback((name: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);


  // Utility functions
  const clearBackendErrors = useCallback(() => {
    setBackendErrors({});
  }, []);

  const resetToFirstPage = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Function to export all sub categories
  const exportAllStores = async () => {
    try {
      // Call API without pagination to get all data
      const response = await storeService.getStores({});
      return response.data;
    } catch (error) {
      console.error('Error exporting all sub categories:', error);
      throw error;
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    return `${d}-${m}-${y}`;
  };
  return {
    // State
    stores,
    categories,
    loadingCategories,
    loading,
    saving,
    isOpen,
    selectedStore,
    mode,
    backendErrors,
    pagination,
    total,
    status,

    // Actions
    setPagination,
    handleView,
    handleEdit,
    handleCreate,
    handleCloseModal,
    handleSoftDelete,
    handleForceDelete,
    handleRestore,
    handleSave,
    handleFilterChange,
    clearBackendErrors,
    resetToFirstPage,
    loadStores,
    exportAllStores,
    formatDate,
  };
};