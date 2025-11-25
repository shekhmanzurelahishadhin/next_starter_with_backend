// hooks/useAlert.ts
import Swal from 'sweetalert2';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

interface AlertOptions {
  title?: string;
  text?: string;
  icon?: AlertType;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  timer?: number;
}

export const useAlert = () => {
  const defaultOptions = {
    theme: 'auto' as const,
    reverseButtons: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  };

  // Basic alert
  const alert = (options: AlertOptions) => {
    return Swal.fire({
      ...defaultOptions,
      ...options,
    });
  };

  // Confirmation dialog
  const confirm = (options: AlertOptions) => {
    return Swal.fire({
      ...defaultOptions,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Yes',
      ...options,
    });
  };

  // Success alert
  const success = (title: string, text?: string) => {
    return alert({ title, text, icon: 'success' });
  };

  // Error alert
  const error = (title: string, text?: string) => {
    return alert({ title, text, icon: 'error' });
  };

  // Warning alert
  const warning = (title: string, text?: string) => {
    return alert({ title, text, icon: 'warning' });
  };

  // Loading alert
  const loading = (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  // Close any open alert
  const close = () => {
    Swal.close();
  };

  return {
    alert,
    confirm,
    success,
    error,
    warning,
    loading,
    close,
  };
};