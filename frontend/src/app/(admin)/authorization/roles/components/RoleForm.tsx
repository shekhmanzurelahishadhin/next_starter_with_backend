"use client";
import { useRef } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Role } from "@/services/roleService";

interface RoleFormProps {
  role?: Role | null;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (roleData: { name: string; guard_name?: string }) => void;
}

export function RoleForm({ role, mode, saving, onSubmit }: RoleFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roleData = {
      name: formData.get('name') as string,
    };
    onSubmit(roleData);
  };

  return (
    <form 
      id="role-form"
      ref={formRef} 
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <div>
          <Label>Role Name *</Label>
          <Input
            type="text"
            name="name"
            placeholder="admin, user, manager, etc."
            defaultValue={role?.name || ''}
            required
            disabled={saving}
          />
        </div>
      </div>
    </form>
  );
}