"use client";
import { Controller, useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Lookup } from "@/services/lookupService";
import { useEffect } from "react";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import ReactSelect from "@/components/form/ReactSelect";

interface LookupFormData {
  name: string;
  type: string;
  code: string;
  status?: number ;
}

interface LookupFormProps {
  status: { value: number; label: string }[];
  lookup?: Lookup | null;
  loadingCategories: boolean;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (lookupData: LookupFormData) => void;
  backendErrors?: Record<string, string>;
}

export function LookupForm({ status, lookup, mode, saving, onSubmit, backendErrors }: LookupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    control,
  } = useForm<LookupFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "",
      code: "",
    }
  });

  // Handle backend errors
  useEffect(() => {
    if (backendErrors) {
      clearErrors();
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field as keyof LookupFormData, {
          type: 'server',
          message: Array.isArray(message) ? message[0] : message
        });
      });
    }
  }, [backendErrors, setError, clearErrors]);

  useEffect(() => {
    if (mode === 'edit' && lookup) {
      reset({
        name: lookup?.name ?? '',
        type: lookup?.type ?? '',
        code: lookup?.code ?? '',
        status: lookup?.status ?? 1,
      });
    } else {
      reset({
        name: '',
        type: '',
        code: '',
      });
    }
  }, [lookup, reset, mode]);

  const onFormSubmit = (data: LookupFormData) => {
    onSubmit(data);
  };


  return (
    <form id="sub-category-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-2">
    
        <div>
          <Label htmlFor="name" required>Lookup Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter lookup name."
            register={register("name", {
              required: "Lookup name is required",
              minLength: {
                value: 2,
                message: "Lookup name must be at least 2 characters"
              },
              maxLength: {
                value: 50,
                message: "Lookup name must not exceed 50 characters"
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