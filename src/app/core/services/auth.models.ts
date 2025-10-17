// --- INTERFACES AND TYPES ---

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe: boolean;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_CUSTOMER' | 'ROLE_RESTAURANT' | 'ROLE_DELIVERY_AGENT' | null;

export interface AuthResponse {
    jwt: string;
    user: number; // Represents the userId
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