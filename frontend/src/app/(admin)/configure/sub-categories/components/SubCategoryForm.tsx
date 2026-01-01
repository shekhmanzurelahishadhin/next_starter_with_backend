"use client";
import { Controller, useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { SubCategory } from "@/services/subCategoryService";
import { useEffect } from "react";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

interface SubCategoryFormData {
  name: string;
  description: string;
  status?: number;
}

interface SubCategoryFormProps {
  status: { value: string; label: string }[];
  subCategory?: SubCategory | null;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (subCategoryData: SubCategoryFormData) => void;
  backendErrors?: Record<string, string>;
}

export function SubCategoryForm({ status, subCategory, mode, saving, onSubmit, backendErrors }: SubCategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    control,
  } = useForm<SubCategoryFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    }
  });

  // Handle backend errors
  useEffect(() => {
    if (backendErrors) {
      clearErrors();
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field as keyof SubCategoryFormData, {
          type: 'server',
          message: Array.isArray(message) ? message[0] : message
        });
      });
    }
  }, [backendErrors, setError, clearErrors]);

  useEffect(() => {
    if (mode === 'edit' && subCategory) {
      reset({
        name: subCategory?.name ?? '',
        description: subCategory?.description ?? '',
        status: Number(subCategory?.status ?? 1),
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [subCategory, reset, mode]);

  const onFormSubmit = (data: SubCategoryFormData) => {
    onSubmit(data);
  };


  return (
    <form id="sub-category-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-2">
        <div>
          <Label htmlFor="name" required>Sub Category Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter sub-category name."
            register={register("name", {
              required: "Sub Category name is required",
              minLength: {
                value: 2,
                message: "Sub Category name must be at least 2 characters"
              },
              maxLength: {
                value: 50,
                message: "Sub Category name must not exceed 50 characters"
              },
            })}
            error={errors.name?.message}
            disabled={saving}
          />
        </div>

        <div>
          <Label>Description</Label>

          <Controller
            name="description"
            control={control}
            rules={{
              maxLength: {
                value: 255,
                message: "Max length is 255 characters",
              },
            }}
            render={({ field }) => (
              <TextArea
                id="description"
                placeholder="Enter sub category description."
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.description?.message}
                disabled={saving}
                rows={3}
              />
            )}
          />
        </div>

        {/* Show status field only in edit mode */}
        {mode === "edit" && (
          <div>
            <Label htmlFor="status">Status</Label>

            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <div className="relative">
                  <Select
                    options={status}
                    value={field.value?.toString() ?? ""}
                    placeholder="Select Status"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={saving}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              )}
            />
            {errors.status?.message && (
              <p className="mt-1.5 text-xs text-error-500">
                {errors.status.message}
              </p>
            )}
          </div>
        )}

      </div>
    </form>
  );
}