"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { validateRegisterForm, type RegisterFormErrors } from "./validation";
import { getApiErrorMessage } from "@/lib/core/shared/errors";

export interface UseRegisterFormOptions {
  successMessage: string;
  errorMessage: string;
  redirectTo?: string;
}

export function useRegisterForm({
  successMessage,
  errorMessage,
  redirectTo = "/account",
}: UseRegisterFormOptions) {
  const { register } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateRegisterForm({
      displayName,
      email,
      phone,
      password,
      confirmPassword,
    });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsLoading(true);
    try {
      await register({
        email,
        password,
        displayName,
        phone: phone.trim() || undefined,
      });
      toast.success(successMessage);
      router.push(redirectTo);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, errorMessage));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: {
      displayName,
      email,
      phone,
      password,
      confirmPassword,
      showPassword,
      isLoading,
      errors,
    },
    actions: {
      setDisplayName,
      setEmail,
      setPhone,
      setPassword,
      setConfirmPassword,
      togglePasswordVisibility: () => setShowPassword((v) => !v),
      handleSubmit,
    },
  };
}

export type RegisterFormApi = ReturnType<typeof useRegisterForm>;
