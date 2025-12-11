"use client";
import { useForm, Controller } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Permission } from "@/services/permissionService";
import { useEffect } from "react";
import ReactSelect from "@/components/form/ReactSelect";

interface PermissionFormData {
  name: string;
  module_id: number | null;
  menu_id: number | null;
  sub_menu_id: number | null;
}

interface PermissionFormProps {
  permission?: Permission | null;
  mode: "create" | "edit";
  saving: boolean;
  onSubmit: (permissionData: PermissionFormData) => void;
  backendErrors?: Record<string, string>;
  modules: { value: number; label: string }[];
  menus: { value: number; label: string }[];
  submenus: { value: number; label: string }[];
  loadingModules: boolean;
  loadingMenus: boolean;
  loadingSubmenus: boolean;
  fetchMenus: (moduleId: number | null) => void;
  fetchSubmenus: (menuId: number | null) => void;
}

export function PermissionForm({
  permission,
  mode,
  saving,
  onSubmit,
  backendErrors,
  modules,
  menus,
  submenus,
  loadingModules,
  loadingMenus,
  loadingSubmenus,
  fetchMenus,
  fetchSubmenus
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    control,
    watch,
  } = useForm<PermissionFormData>({
    mode: "onChange",
    defaultValues: {
      name: permission?.name || "",
      module_id: permission?.module_id || null,
      menu_id: permission?.menu_id || null,
      sub_menu_id: permission?.sub_menu_id || null,
    },
  });

  const watchedModuleId = watch("module_id");
  const watchedMenuId = watch("menu_id");

  /* ----------------------------------------
   * OPTIMIZED: Only reset when module actually changes
   * ---------------------------------------- */
  useEffect(() => {
    if (mode === 'create') {
    fetchMenus(watchedModuleId || null);
    }
    reset((prevValues) => ({
      ...prevValues,
      menu_id: null,
      sub_menu_id: null,
    }));
    console.log('Module changed, resetting menu and submenu');
  }, [watchedModuleId, reset]);

  useEffect(() => {
    if (mode === 'create') {
    fetchSubmenus(watchedMenuId || null);
    }
    reset((prevValues) => ({
      ...prevValues,
      sub_menu_id: null,
    }));
  }, [watchedMenuId, reset]);


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
  }, [backendErrors, clearErrors, setError]);


  useEffect(() => {
    if (permission) {
      reset({
        name: permission.name || "",
        module_id: permission.module_id || null,
        menu_id: permission.menu_id || null,
        sub_menu_id: permission.sub_menu_id || null,
      });
    }
  }, [permission, reset]);

  const onFormSubmit = (data: PermissionFormData) => {
    onSubmit(data);
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
              minLength: { value: 2, message: "Must be at least 2 characters" },
              maxLength: { value: 50, message: "Cannot exceed 50 characters" },
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
            render={({ field, fieldState }) => (
              <ReactSelect
                options={modules}
                   value={field.value}
                  onChange={(value) => field.onChange(value)}
                isDisabled={saving}
                isLoading={loadingModules}
                error={fieldState.error?.message}
                placeholder="Select a module"
              />
            )}
          />
        </div>

        {/* Menu Select */}
        <div>
          <Label htmlFor="menu_id" required>
            Menu
          </Label>
          <Controller
            name="menu_id"
            control={control}
            rules={{ required: "Menu is required" }}
            render={({ field, fieldState }) => (
              <ReactSelect
                options={menus}
                value={field.value}
                  onChange={(value) => field.onChange(value)}
                isDisabled={saving || !watchedModuleId}
                isLoading={loadingMenus}
                error={fieldState.error?.message}
                placeholder={
                  watchedModuleId ? "Select menu" : "Select a module first"
                }
              />
            )}
          />
        </div>

        {/* Submenu Select */}
        <div>
          <Label htmlFor="sub_menu_id">Submenu</Label>
          <Controller
            name="sub_menu_id"
            control={control}
            render={({ field, fieldState }) => (
              <ReactSelect
                options={submenus}
                value={field.value}
                  onChange={(value) => field.onChange(value)}
                isDisabled={saving || !watchedMenuId}
                isLoading={loadingSubmenus}
                error={fieldState.error?.message}
                placeholder={
                  watchedMenuId
                    ? "Select submenu (optional)"
                    : "Select a menu first"
                }
                isClearable={true}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
}
