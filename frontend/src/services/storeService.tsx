import { api } from "@/lib/api";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface Store {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  slug: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  per_page: number;
  total_pages?: number;
}

export interface StoreFilters {
  search?: string;
  page?: number;
  per_page?: number;
  name?: string;
  slug?: string;
  category_name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

class StoreService {
  private getCacheKey(filters: StoreFilters): string {
    return `stores_${JSON.stringify(filters)}`;
  }

  private setCache(key: string, data: any): void {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private getCache(key: string): any {
    const cached = cache.get(key);
    // check expiration
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(key); // expired → delete it
    return null;
  }

  async getStores(filters: StoreFilters = {}): Promise<PaginatedResponse<Store>> {
    const params = new URLSearchParams();

    // Common filter fields
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    // Specific filter fields
    if (filters.name) params.append('name', filters.name);
    if (filters.slug) params.append('slug', filters.slug);
    if (filters.category_name) params.append('category_name', filters.category_name);
    if (filters.status) params.append('status', filters.status);
    if (filters.created_at) params.append('created_at', filters.created_at);
    if (filters.updated_at) params.append('updated_at', filters.updated_at);

    const response = await api.get(`/configure/stores?${params}`);
    const result = response.data.data;

    return result;
  }

  async createStore(categoryData: { name: string, category_id: number }): Promise<Store> {

    const response = await api.post('/configure/stores', categoryData);
    return response.data.data;
  }

  async updateStore(id: number, categoryData: { name: string, category_id: number, status: string }): Promise<Store> {

    const response = await api.put(`/configure/stores/${id}`, categoryData);
    return response.data.data;
  }

  async softDeleteStore(id: number): Promise<void> {
    await api.post(`/configure/stores/trash/${id}`);
  }

  async forceDeleteStore(id: number): Promise<void> {
    await api.delete(`/configure/stores/${id}`);
  }

  async restoreStore(id: number): Promise<void> {
    await api.post(`/configure/stores/restore/${id}`);
  }
}

export const storeService = new StoreService();