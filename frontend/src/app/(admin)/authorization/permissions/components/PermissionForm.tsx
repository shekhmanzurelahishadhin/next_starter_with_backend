"use client";
import { useForm, Controller } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Permission } from "@/services/permissionService";
import { useEffect } from "react";
import ReactSelect from "@/components/form/ReactSelect";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionFormData {
  name: string;
  module_id: number | null;
}

interface PermissionFormProps {
  permission?: Permission | null;
  mode: "create" | "edit";
  saving: boolean;
  onSubmit: (permissionData: PermissionFormData) => void;
  backendErrors?: Record<string, string>;
}

export function PermissionForm({
  permission,
  mode,
  saving,
  onSubmit,
  backendErrors,
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    control,
  } = useForm<PermissionFormData>({
    mode: "onChange",
    defaultValues: {
      name: permission?.name || "",
      module_id: permission?.module_id || null,
    },
  });

  const { modules } = usePermissions();
  console.log("Modules:", modules);

  // Handle backend validation errors
  useEffect(() => {
    if (backendErrors) {
      clearErrors();
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field as keyof PermissionFormData, {
          type: "server",
          message: Array.isArray(message) ? message[0] : message,
        });
      });
    }
  }, [backendErrors, setError, clearErrors]);

  // Reset when editing data
  useEffect(() => {
    reset({
      name: permission?.name || "",
      module_id: permission?.module_id || null,
    });
  }, [permission, reset]);

  const onFormSubmit = (data: PermissionFormData) => {
    console.log("Submitted:", data);
    // onSubmit(data);
  };

  return (
    <form id="permission-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-5">
        {/* Permission Name */}
        <div>
          <Label htmlFor="name" required>
            Permission Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="unit.create, unit.edit, etc."
            register={register("name", {
              required: "Permission name is required",
              minLength: {
                value: 2,
                message: "Must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Cannot exceed 50 characters",
              },
            })}
            error={errors.name?.message}
            disabled={saving}
          />
        </div>

        {/* Module Select */}
        <div>
          <Label htmlFor="module_id" required>
            Module
          </Label>

          <Controller
            name="module_id"
            control={control}
            rules={{ required: "Module is required" }}
            render={({ field }) => (
              <>
                <ReactSelect
                  options={modules}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  isDisabled={saving}
                  placeholder="Select a module"
                />

                {errors.module_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.module_id.message}
                  </p>
                )}
              </>
            )}
          />

        </div>
      </div>
    </form>
  );
}
