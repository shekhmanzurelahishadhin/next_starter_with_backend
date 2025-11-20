// services/roleService.ts
import {api} from "@/lib/api";

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export const roleService = {
  // Fetch all roles
  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data.data;
  },

  // Fetch single role by ID
  getRoleById: async (id: number): Promise<Role> => {
    const response = await api.get(`/roles/${id}`);
    return response.data.data;
  },

  // Create new role
  createRole: async (roleData: { name: string; guard_name: string }): Promise<Role> => {
    const response = await api.post('/roles', roleData);
    return response.data.data;
  },

  // Update role
  updateRole: async (id: number, roleData: { name: string; guard_name: string }): Promise<Role> => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data.data;
  },

  // Delete role
  deleteRole: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },
};