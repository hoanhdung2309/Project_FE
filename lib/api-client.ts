import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

/* ── Request Interceptor: attach JWT Bearer token ── */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ── Response Interceptor: handle 401 → redirect to /login ── */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Clear cookie as well (set by middleware)
      document.cookie = "access_token=; path=/; max-age=0";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
