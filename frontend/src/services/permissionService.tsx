import { api } from "@/lib/api";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  per_page: number;
  total_pages?: number;
}

export interface PermissionFilters {
  search?: string;
  page?: number;
  per_page?: number;
  name?: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
}

class PermissionService {
  private getCacheKey(filters: PermissionFilters): string {
    return `permissions_${JSON.stringify(filters)}`;
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

  async getPermissions(filters: PermissionFilters = {}): Promise<PaginatedResponse<Permission>> {
    // Don't cache searches
    // if (!filters.search) {
    //   const cacheKey = this.getCacheKey(filters);
    //   const cached = this.getCache(cacheKey);
    //   console.log('PermissionService.getPermissions - cacheKey:', cacheKey, 'cached:', cached);
    //   if (cached) return cached;
    // }

    const params = new URLSearchParams();
    
    // Common filter fields
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    // Specific filter fields
    if (filters.name) params.append('name', filters.name);
    if (filters.guard_name) params.append('guard_name', filters.guard_name);
    if (filters.created_at) params.append('created_at', filters.created_at);
    if (filters.updated_at) params.append('updated_at', filters.updated_at);
    
    const response = await api.get(`/permissions?${params}`);
    const result = response.data;

    // Cache non-search results
    // if (!filters.search) {
    //   const cacheKey = this.getCacheKey(filters);
    //   this.setCache(cacheKey, result);
    // }

    return result;
  }

  async createPermission(permissionData: { name: string }): Promise<Permission> {
    // Clear cache on create
    // cache.clear();
    const response = await api.post('/permissions', permissionData);
    return response.data.data;
  }

  async updatePermission(id: number, permissionData: { name: string }): Promise<Permission> {
    // Clear cache on update
    // cache.clear();
    const response = await api.put(`/permissions/${id}`, permissionData);
    return response.data.data;
  }

  async deletePermission(id: number): Promise<void> {
    // Clear cache on delete
    // cache.clear();
    await api.delete(`/permissions/${id}`);
  }


}

export const permissionService = new PermissionService();