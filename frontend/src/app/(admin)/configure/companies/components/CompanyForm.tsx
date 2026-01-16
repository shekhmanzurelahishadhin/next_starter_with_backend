"use client";
import { Controller, useForm } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Company } from "@/services/companyService";
import { useEffect } from "react";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

interface CompanyFormData {
  name: string;
  status?: number;
}

interface CompanyFormProps {
  status: { value: number; label: string }[];
  company?: Company | null;
  mode: 'create' | 'edit';
  saving: boolean;
  onSubmit: (companyData: CompanyFormData) => void;
  backendErrors?: Record<string, string>;
}

export function CompanyForm({ status, company, mode, saving, onSubmit, backendErrors }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    control,
  } = useForm<CompanyFormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
    }
  });

  // Handle backend errors
  useEffect(() => {
    if (backendErrors) {
      clearErrors();
      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field as keyof CompanyFormData, {
          type: 'server',
          message: Array.isArray(message) ? message[0] : message
        });
      });
    }
  }, [backendErrors, setError, clearErrors]);

  useEffect(() => {
    if (mode === 'edit' && company) {
      reset({
        name: company?.name ?? '',
        status: Number(company?.status ?? 1),
      });
    } else {
      reset({
        name: '',
      });
    }
  }, [company, reset, mode]);

  const onFormSubmit = (data: CompanyFormData) => {
    onSubmit(data);
  };


  return (
    <form id="company-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-2">
        <div>
          <Label htmlFor="name" required>Company Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter company name."
            register={register("name", {
              required: "Company name is required",
              minLength: {
                value: 2,
                message: "Company name must be at least 2 characters"
              },
              maxLength: {
                value: 50,
                message: "Company name must not exceed 50 characters"
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