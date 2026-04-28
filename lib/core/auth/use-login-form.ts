"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { validateLoginForm, type LoginFormErrors } from "./validation";
import { getApiErrorMessage } from "@/lib/core/shared/errors";

export interface UseLoginFormOptions {
  successMessage: string;
  errorMessage: string;
  defaultRedirect?: string;
}

export function useLoginForm({
  successMessage,
  errorMessage,
  defaultRedirect = "/account",
}: UseLoginFormOptions) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") ?? defaultRedirect;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateLoginForm({ email, password });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success(successMessage);
      router.push(redirectTo);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, errorMessage));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    state: { email, password, showPassword, isLoading, errors },
    actions: {
      setEmail,
      setPassword,
      togglePasswordVisibility: () => setShowPassword((v) => !v),
      handleSubmit,
    },
  };
}

export type LoginFormApi = ReturnType<typeof useLoginForm>;
