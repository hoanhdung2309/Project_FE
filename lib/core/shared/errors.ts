export function getApiErrorMessage(err: unknown, fallback: string): string {
  const maybe = err as
    | { response?: { data?: { message?: string } } }
    | null
    | undefined;
  return maybe?.response?.data?.message ?? fallback;
}
