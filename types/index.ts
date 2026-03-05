/* ─────────────────────────────────────────
   Auth  –  /api/auth
───────────────────────────────────────── */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Backend response: POST /api/auth/login | register */
export interface LoginResponse {
  accessToken: string;   // camelCase – matches .NET naming
  tokenType: string;     // "Bearer"
  expiresAtUtc: string;  // ISO 8601
  user: User;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "Customer" | "Admin";
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordWithOtpRequest {
  email: string;
  otp: string;
  newPassword: string;
}

/* ─────────────────────────────────────────
   Products  –  /api/products
───────────────────────────────────────── */

/** Matches backend ProductResponse DTO */
export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  baseRetailPrice: number;
  unit: string;
  isActive: boolean;
  createdAtUtc: string;
  /** Included when fetching by id (via ProductRepository Include) */
  wholesalePrices?: WholesalePrice[];
}

export interface WholesalePrice {
  id: string;
  productId: string;
  minQuantity: number;
  unitPrice: number;
  tierName?: string;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  sku?: string;
  baseRetailPrice: number;
  unit?: string;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  sku?: string;
  baseRetailPrice?: number;
  unit?: string;
  isActive?: boolean;
}

export interface UpdatePriceRequest {
  retailPrice: number;
  tiers: {
    minQuantity: number;
    unitPrice: number;
    tierName?: string;
  }[];
}

/* ─────────────────────────────────────────
   Price Calculation  –  /api/orders
───────────────────────────────────────── */

/** POST /api/orders/calculate-price */
export interface PriceCalculationRequest {
  items: { productId: string; quantity: number }[];
}

export interface PriceCalculationItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PriceCalculationResponse {
  totalAmount: number;
  itemPrices: PriceCalculationItem[];
}

/* ─────────────────────────────────────────
   Orders  –  /api/orders
───────────────────────────────────────── */

/**
 * Matches backend OrderStatus enum.
 * .NET serialises enums as numbers by default; configure JsonStringEnumConverter
 * on the backend to send these as strings.
 */
export type OrderStatus =
  | "Draft"
  | "Submitted"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

/** Numeric values mirroring C# enum for reference */
export const ORDER_STATUS_VALUE: Record<OrderStatus, number> = {
  Draft:     0,
  Submitted: 1,
  Confirmed: 2,
  Shipped:   3,
  Delivered: 4,
  Cancelled: 5,
};

/** Backend may return status as number; map to OrderStatus */
export const ORDER_STATUS_FROM_NUM: Record<number, OrderStatus> = {
  0: "Draft",
  1: "Submitted",
  2: "Confirmed",
  3: "Shipped",
  4: "Delivered",
  5: "Cancelled",
};

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  actualQuantity?: number;
  unit?: string;
  /** Backend detail endpoint may send lineTotal per row */
  lineTotal?: number;
}

/** Order line as returned by GET /api/orders/{id} (orderItems array) */
export interface OrderOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName?: string;
}

/** Backend OrderResponse DTO (detail: GET /api/orders/{id}) */
export interface OrderResponse {
  id: string;
  orderCode?: string;
  userId: string;
  /** Backend may serialise as number (0=Draft, …) */
  status: OrderStatus | number;
  totalAmount: number;
  notes?: string;
  createdAtUtc: string;
  user?: OrderUser;
  /** Legacy / alias */
  items?: OrderItemResponse[];
  /** Detail endpoint: orderItems */
  orderItems?: OrderOrderItem[];
}

/** User nested in order list/detail (backend include) */
export interface OrderUser {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role?: number;
  isActive?: boolean;
  createdAtUtc?: string;
}

/**
 * Shape returned by GET /api/orders or GET /api/admin/orders (list view).
 * Backend may send status as number; include optional user for customer display.
 */
export interface OrderListItem {
  id: string;
  orderCode?: string;
  orderNumber?: string;
  userId: string;
  customerName?: string;
  /** Nested user from API – use for display when customerName not set */
  user?: OrderUser;
  itemCount?: number;
  totalAmount: number;
  /** Backend may serialise enum as number (0=Draft, 1=Submitted, …) */
  status: OrderStatus | number;
  createdAtUtc: string;
  createdAt?: string;
}

/** Normalise backend status (number or string) to OrderStatus */
export function normalizeOrderStatus(s: OrderStatus | number): OrderStatus {
  return typeof s === "number" ? (ORDER_STATUS_FROM_NUM[s] ?? "Draft") : s;
}

/** Display name for customer: user.displayName | user.email | customerName | userId */
export function getOrderCustomerName(o: OrderListItem): string {
  return o.user?.displayName ?? o.user?.email ?? o.customerName ?? o.userId;
}

export interface OrderCreateRequest {
  userId: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
}

/* ─────────────────────────────────────────
   Admin – Orders  –  /api/admin/orders
───────────────────────────────────────── */

/** Body for PATCH /api/admin/orders/{id}/adjust (sent as array, not object) */
export interface AdjustmentItemDto {
  orderItemId: string;   // uses orderItemId, not itemId
  actualQuantity: number;
}

export interface AdjustOrderResult {
  orderId: string;
  originalTotal: number;
  adjustedTotal: number;
  difference: number;
  status: OrderStatus;
}

export interface ConfirmOrderResult {
  orderId: string;
  status: OrderStatus;
  confirmedAtUtc: string;
}

/* ─────────────────────────────────────────
   Inventory (FEFO)
───────────────────────────────────────── */
export type BatchStatus = "Fresh" | "Expiring" | "Expired";

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  batchCode?: string;
  productId: string;
  productName: string;
  category?: string;
  quantity: number;
  unit: string;
  harvestDate?: string;
  receivedAt?: string;
  expiryDate: string;
  status: BatchStatus;
  daysUntilExpiry: number;
  supplierName?: string;
}

/* ─────────────────────────────────────────
   SignalR – /hubs/chat
───────────────────────────────────────── */

/**
 * Received via "ReceiveChat" event from the hub.
 * Backend sends: (string senderId, string message, string timestamp)
 * as positional args, NOT as an object.
 */
export interface ReceivedChatMessage {
  senderId: string;
  message: string;
  timestamp: string;
}

/* ─────────────────────────────────────────
   Admin – Users  –  /api/admin/users
───────────────────────────────────────── */

export type UserRole = "Customer" | "Wholesaler" | "Admin";

export interface UserSummaryResponse {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  creditLimit?: number;
  createdAtUtc: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserStatusRequest {
  isActive?: boolean;
  creditLimit?: number;
}

export interface AdminResetPasswordRequest {
  newPassword: string;
}

/* ─────────────────────────────────────────
   Frontend-only helpers (not backend DTOs)
───────────────────────────────────────── */

/** UI helper – derived from WholesalePrice for price-tier table display */
export interface PriceTier {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  label: string;
}

/** Merged product shape used by shop page */
export interface Product extends ProductResponse {
  priceTiers: PriceTier[];   // derived from wholesalePrices
  badge?: string;
  category?: string;
  stockQuantity?: number;
}
