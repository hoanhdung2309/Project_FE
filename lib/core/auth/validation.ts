export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 6;

export interface ValidationError {
  key: string;
  params?: Record<string, string | number>;
}

function validateEmail(email: string): ValidationError | undefined {
  if (!email.trim()) return { key: "validation.emailRequired" };
  if (!EMAIL_REGEX.test(email)) return { key: "validation.emailInvalid" };
  return undefined;
}

function validateNewPassword(password: string): ValidationError | undefined {
  if (!password) return { key: "validation.passwordRequired" };
  if (password.length < PASSWORD_MIN_LENGTH)
    return {
      key: "validation.passwordMinLength",
      params: { min: PASSWORD_MIN_LENGTH },
    };
  return undefined;
}

function validateConfirm(a: string, b: string): ValidationError | undefined {
  return a === b ? undefined : { key: "validation.passwordMismatch" };
}

export interface LoginFormValues {
  email: string;
  password: string;
}
export type LoginFormErrors = Partial<Record<keyof LoginFormValues, ValidationError>>;

export function validateLoginForm(v: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const email = validateEmail(v.email);
  if (email) errors.email = email;
  if (!v.password) errors.password = { key: "validation.passwordRequired" };
  return errors;
}

export interface RegisterFormValues {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, ValidationError>>;

export function validateRegisterForm(v: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  if (!v.displayName.trim()) errors.displayName = { key: "validation.displayNameRequired" };
  const email = validateEmail(v.email);
  if (email) errors.email = email;
  const password = validateNewPassword(v.password);
  if (password) errors.password = password;
  const confirm = validateConfirm(v.confirmPassword, v.password);
  if (confirm) errors.confirmPassword = confirm;
  return errors;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export type ChangePasswordFormErrors = Partial<
  Record<keyof ChangePasswordFormValues, ValidationError>
>;

export function validateChangePasswordForm(
  v: ChangePasswordFormValues,
): ChangePasswordFormErrors {
  const errors: ChangePasswordFormErrors = {};
  if (!v.currentPassword) errors.currentPassword = { key: "validation.currentPasswordRequired" };
  const password = validateNewPassword(v.newPassword);
  if (password) errors.newPassword = password;
  else if (v.newPassword === v.currentPassword)
    errors.newPassword = { key: "validation.newPasswordSame" };
  const confirm = validateConfirm(v.confirmPassword, v.newPassword);
  if (confirm) errors.confirmPassword = confirm;
  return errors;
}

export interface ForgotPasswordEmailValues {
  email: string;
}

export function validateForgotPasswordEmail(
  v: ForgotPasswordEmailValues,
): ValidationError | undefined {
  return validateEmail(v.email);
}

export interface ResetPasswordFormValues {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
export type ResetPasswordFormErrors = Partial<
  Record<keyof ResetPasswordFormValues, ValidationError>
>;

export function validateResetPasswordForm(
  v: ResetPasswordFormValues,
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};
  if (!v.otp.trim()) errors.otp = { key: "validation.otpRequired" };
  const password = validateNewPassword(v.newPassword);
  if (password) errors.newPassword = password;
  const confirm = validateConfirm(v.confirmPassword, v.newPassword);
  if (confirm) errors.confirmPassword = confirm;
  return errors;
}
