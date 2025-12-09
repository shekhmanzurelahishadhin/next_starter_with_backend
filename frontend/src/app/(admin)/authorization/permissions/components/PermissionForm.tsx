"use client";
import { useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Permission } from "@/services/permissionService";
import { useEffect } from "react";

interface PermissionFormData {
  name: string;
}

interface PermissionFormProps {
  permission?: Permission | null;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (permissionData: { name: string }) => void;
  backendErrors?: Record<string, string>; // Add backend errors prop
}

export function PermissionForm({ permission, mode, saving, onSubmit, backendErrors }: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError, // Add setError from react-hook-form
    clearErrors, // Add clearErrors
  } = useForm<PermissionFormData>({
    mode: "onChange",
    defaultValues: {
      name: permission?.name || '',
    }
  });

  // Handle backend errors
  useEffect(() => {
    if (backendErrors) {
      // Clear existing errors first
      clearErrors();
      
      // Set backend errors on the form
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field as keyof PermissionFormData, {
          type: 'server',
          message: Array.isArray(message) ? message[0] : message
        });
      });
    }
  }, [backendErrors, setError, clearErrors]);

  useEffect(() => {
    reset({
      name: permission?.name || '',
    });
  }, [permission, reset]);

  const onFormSubmit = (data: PermissionFormData) => {
    onSubmit(data);
  };

  return (
    <form id="permission-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-5">
        <div>
          <Label htmlFor="name" required>Permission Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="admin, user, manager, etc."
            register={register("name", {
              required: "Permission name is required",
              minLength: {
                value: 2,
                message: "Permission name must be at least 2 characters"
              },
              maxLength: {
                value: 50,
                message: "Permission name must not exceed 50 characters"
              },
            })}
            error={errors.name?.message}
            disabled={saving}
          />
        </div>
      </div>
    </form>
  );
}