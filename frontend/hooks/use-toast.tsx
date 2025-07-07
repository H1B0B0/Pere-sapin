"use client";

import { addToast } from "@heroui/toast";

export type ToastType =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  timeout?: number;
}

export const useToast = () => {
  const showToast = ({
    title = "",
    description = "",
    type = "default",
    timeout = 5000,
  }: ToastOptions) => {
    addToast({
      title,
      description,
      color: type,
      timeout,
    });
  };

  const showSuccess = (title: string, description?: string) => {
    showToast({ title, description, type: "success" });
  };

  const showError = (title: string, description?: string) => {
    showToast({ title, description, type: "danger" });
  };

  const showWarning = (title: string, description?: string) => {
    showToast({ title, description, type: "warning" });
  };

  const showInfo = (title: string, description?: string) => {
    showToast({ title, description, type: "primary" });
  };

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
