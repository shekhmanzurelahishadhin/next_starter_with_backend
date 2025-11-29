"use client";
import { useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Role } from "@/services/roleService";
import { useEffect } from "react";

interface RoleFormData {
  name: string;
}

interface RoleFormProps {
  role?: Role | null;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (roleData: { name: string; guard_name?: string }) => void;
}

export function RoleForm({ role, mode, saving, onSubmit }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormData>({
    mode: "onChange",
    defaultValues: {
      name: role?.name || '',
    }
  });

  useEffect(() => {
    reset({
      name: role?.name || '',
    });
  }, [role, reset]);

  const onFormSubmit = (data: RoleFormData) => {
    onSubmit(data);
  };

  return (
    <form id="role-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-5">
        <div>
          <Label htmlFor="name">Role Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="admin, user, manager, etc."
            register={register("name", {
              required: "Role name is required",
              minLength: {
                value: 2,
                message: "Role name must be at least 2 characters"
              },
              maxLength: {
                value: 50,
                message: "Role name must not exceed 50 characters"
              },
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/,
                message: "Role name can only contain letters, numbers, hyphens and underscores"
              }
            })}
            error={errors.name?.message} // error message
            disabled={saving}
          />
        </div>
      </div>
    </form>
  );
}