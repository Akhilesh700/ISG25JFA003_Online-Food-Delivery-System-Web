export interface RestaurantSignupRequest {
    email: string;
    password: string;
    name: string;
    openTime: string;
    closeTime: string;
    phone: string;
    address: string;
}

export interface RestaurantSignupResponse {
    email: string;
    role: string;
    userId: number;
    restId: number;
}

export interface RestaurantResponse {
    name: string;
    address: string;
    phone: string;
    openTime: string;
    closeTime: string;
    profileImageUrl?: string;
}

export interface RestaurantOrderHistoryResponse {
    orderId: number;
    orderTime: string;
    specialReq: string;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    status: string;
}

export interface AcceptRejectOrderResponse {
    statusType?: string;
    status?: string;
    message: string;
}

export interface RestaurantDashboardStats {
    todayOrders: number;
    todayEarnings: number;
    totalOrders: number;
    totalEarnings: number;
    pendingOrders: number;
    completedOrders: number;
    rejectedOrders: number;
}

export interface MonthlyEarnings {
    month: string;
    earnings: number;
    orderCount: number;
}

export interface RestaurantProfileUpdateRequest {
    phone?: string;
    name?: string;
    address?: string;
    openTime?: string;
    closeTime?: string;
}

export interface RestaurantProfileUpdateResponse {
    message: string;
    restaurant?: RestaurantResponse;
}
