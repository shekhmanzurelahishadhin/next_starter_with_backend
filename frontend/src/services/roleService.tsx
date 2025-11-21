// services/roleService.ts
import { api } from "@/lib/api";

export interface Role {
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

export interface RoleFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

class RoleService {
  async getRoles(filters: RoleFilters = {}): Promise<PaginatedResponse<Role>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await api.get(`/roles?${params}`);
    return response.data;
  }

  async createRole(roleData: { name: string }): Promise<Role> {
    const response = await api.post('/roles', roleData);
    return response.data.data;
  }

  async updateRole(id: number, roleData: { name: string }): Promise<Role> {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data.data;
  }

  async deleteRole(id: number): Promise<void> {
    await api.delete(`/roles/${id}`);
  }

  async getPermissions(roleId: number): Promise<{ role: Role; permissions: string[] }> {
    const response = await api.get(`/roles/${roleId}/permissions`);
    return response.data;
  }

  async assignPermissions(roleId: number, permissions: string[]): Promise<void> {
    await api.post(`/roles/${roleId}/assign-permissions`, { permissions });
  }
}

export const roleService = new RoleService();