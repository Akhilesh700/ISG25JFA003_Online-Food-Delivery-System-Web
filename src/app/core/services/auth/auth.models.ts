// --- INTERFACES AND TYPES ---

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe: boolean;    
    deviceName?: string;
    browserName?: string;
    browserVersion?: string;
    timezone?: string;
    deviceType?: string;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT' | 'ROLE_DELIVERY_AGENT' | null;

// Updated AuthResponse
export interface AuthResponse {
    jwt: string;
    refreshToken: string;
    userId: number;
}

// Interface for the Refresh Endpoint Response
export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
}

// Interface for the Refresh Endpoint Request
export interface RefreshRequest {
  refreshToken: string;
}

export interface RestaurantSignupResponse{
    email: string;
    role: string;
    userId: number;
    restId: number;
}
export interface AgentSignupResponse{
    agentId: number;
    status: string;
}
export interface CustomerSignupResponse{
    email: string;
    role: string;
    userId: number;
    createdCartId: number;
}
/**
 * Defines the structure of the JWT payload for strong typing and predictable access to claims.
 */
export interface JwtPayload {
    sub: string;   // Subject, which holds the username.
    userId: string; // Custom claim for the user ID.
    iat: number;   // Issued at timestamp.
    exp: number;   // Expiration time timestamp.
}


