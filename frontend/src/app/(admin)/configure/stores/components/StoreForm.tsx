"use client";
import { Controller, useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Store } from "@/services/storeService";
import { useEffect } from "react";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import ReactSelect from "@/components/form/ReactSelect";

interface StoreFormData {
  name: string;
  category_id?: number | null;
  status?: number ;
}

interface StoreFormProps {
  status: { value: number; label: string }[];
  store?: Store | null;
  categories?: { value: number; label: string }[];
  loadingCategories: boolean;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (storeData: StoreFormData) => void;
  backendErrors?: Record<string, string>;
}

export function StoreForm({ status, store, categories, loadingCategories, mode, saving, onSubmit, backendErrors }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    control,
  } = useForm<StoreFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      category_id: null,
    }
  });

  // Handle backend errors
  useEffect(() => {
    if (backendErrors) {
      clearErrors();
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field as keyof StoreFormData, {
          type: 'server',
          message: Array.isArray(message) ? message[0] : message
        });
      });
    }
  }, [backendErrors, setError, clearErrors]);

  useEffect(() => {
    if (mode === 'edit' && store) {
      reset({
        name: store?.name ?? '',
        category_id: store?.category_id ?? null,
        status: store?.status ?? 1,
      });
    } else {
      reset({
        name: '',
        category_id: undefined,
      });
    }
  }, [store, reset, mode]);

  const onFormSubmit = (data: StoreFormData) => {
    onSubmit(data);
  };


  return (
    <form id="store-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-2">
           <div>
          <Label htmlFor="category_id" required>
            Category
          </Label>
          <Controller
            control={control}
            name="category_id"
            rules={{
              required: {
                value: true,
                message: "Please select a category"
              }
            }}
            render={({ field, fieldState }) => (
              <ReactSelect
                {...field}
                options={categories || []}
                placeholder="Select category"
                isLoading={loadingCategories}
                error={fieldState.error?.message}
                isDisabled={saving}
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="name" required>Sub-Category Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter store name."
            register={register("name", {
              required: "Sub-Category name is required",
              minLength: {
                value: 2,
                message: "Sub-Category name must be at least 2 characters"
              },
              maxLength: {
                value: 50,
                message: "Sub-Category name must not exceed 50 characters"
              },
            })}
            error={errors.name?.message}
            disabled={saving}
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