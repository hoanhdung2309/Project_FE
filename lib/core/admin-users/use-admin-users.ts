"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import type {
  AdminResetPasswordRequest,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
  UserRole,
  UserSummaryResponse,
} from "@/types";

const USERS_KEY = ["admin-users"] as const;
const userKey = (id: string) => ["admin-user", id] as const;

export const ALL_USER_ROLES: UserRole[] = ["Customer", "Wholesaler", "Admin"];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  Customer: "Khách lẻ",
  Wholesaler: "Khách sỉ",
  Admin: "Quản trị",
};

type BadgeVariant =
  | "default"
  | "pitaya"
  | "cactus"
  | "draft"
  | "submitted"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "fresh"
  | "expiring"
  | "expired";

export const USER_ROLE_BADGE_VARIANT: Record<UserRole, BadgeVariant> = {
  Customer: "default",
  Wholesaler: "pitaya",
  Admin: "cancelled",
};

export const USER_ROLE_FILTER_LABELS: Record<UserRole | "All", string> = {
  All: "Tất cả",
  Customer: "Khách lẻ",
  Wholesaler: "Khách sỉ",
  Admin: "Quản trị",
};

type Callbacks = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useAdminUsersQuery() {
  return useQuery<UserSummaryResponse[]>({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<UserSummaryResponse[]>("/api/admin/users");
      return data;
    },
  });
}

export function useAdminUserDetail(userId: string) {
  return useQuery<UserSummaryResponse>({
    queryKey: userKey(userId),
    queryFn: async () => {
      const { data } = await apiClient.get<UserSummaryResponse>(
        `/api/admin/users/${userId}`,
      );
      return data;
    },
    enabled: Boolean(userId),
  });
}

function invalidateUser(qc: ReturnType<typeof useQueryClient>, userId: string) {
  qc.invalidateQueries({ queryKey: userKey(userId) });
  qc.invalidateQueries({ queryKey: USERS_KEY });
}

export function useUpdateUserRole(userId: string, { onSuccess, onError }: Callbacks = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateUserRoleRequest) => {
      await apiClient.put(`/api/admin/users/${userId}/role`, body);
    },
    onSuccess: () => {
      invalidateUser(qc, userId);
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Cập nhật phân quyền thất bại."));
    },
  });
}

export function useUpdateUserStatus(userId: string, { onSuccess, onError }: Callbacks = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateUserStatusRequest) => {
      await apiClient.patch(`/api/admin/users/${userId}/status`, body);
    },
    onSuccess: () => {
      invalidateUser(qc, userId);
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Cập nhật trạng thái thất bại."));
    },
  });
}

export function useAdminResetPassword(userId: string, { onSuccess, onError }: Callbacks = {}) {
  return useMutation({
    mutationFn: async (body: AdminResetPasswordRequest) => {
      await apiClient.post(`/api/admin/users/${userId}/reset-password`, body);
    },
    onSuccess,
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Đặt lại mật khẩu thất bại."));
    },
  });
}

export interface UserFilter {
  search: string;
  role: UserRole | "All";
}

export function filterUsers(
  users: UserSummaryResponse[],
  { search, role }: UserFilter,
): UserSummaryResponse[] {
  const q = search.trim().toLowerCase();
  return users.filter((u) => {
    const matchSearch =
      !q ||
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone ?? "").toLowerCase().includes(q);
    const matchRole = role === "All" || u.role === role;
    return matchSearch && matchRole;
  });
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  wholesaler: number;
}

export function countUserStats(users: UserSummaryResponse[]): UserStats {
  return {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    wholesaler: users.filter((u) => u.role === "Wholesaler").length,
  };
}

export const MIN_ADMIN_RESET_PASSWORD_LENGTH = 6;

export type AdminResetPasswordError =
  | "too-short"
  | "mismatch";

export function validateAdminResetPassword(
  newPassword: string,
  confirmPassword: string,
): AdminResetPasswordError | null {
  if (newPassword.length < MIN_ADMIN_RESET_PASSWORD_LENGTH) return "too-short";
  if (newPassword !== confirmPassword) return "mismatch";
  return null;
}

export function adminResetPasswordErrorMessage(error: AdminResetPasswordError): string {
  switch (error) {
    case "too-short":
      return `Mật khẩu phải có ít nhất ${MIN_ADMIN_RESET_PASSWORD_LENGTH} ký tự.`;
    case "mismatch":
      return "Mật khẩu xác nhận không khớp.";
  }
}

export function parseCreditLimit(raw: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = parseFloat(raw);
  return Number.isNaN(n) ? undefined : n;
}
