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
    restaurantId: number;
    name: string;
    address: string;
    bannerUrl: string;
    logoUrl: string;
    rating: number;
    ETA: number;
    isOpen: boolean;
    deliveryFee: number;
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
    orderId: number;
    status: string;
    message: string;
}
