import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { environment } from 'src/environments/environment'; // Assuming you have environment setup

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Use distinct keys for access and refresh tokens
  private readonly ACCESS_TOKEN_KEY = environment.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.refreshTokenKey;

  constructor() { }

  // --- Access Token Methods ---

  saveAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const expirationDate = decodedToken.exp * 1000;
      const now = Date.now();
      return expirationDate < now;
    } catch (error) {
      console.error("Error decoding access token:", error);
      return true;
    }
  }

  // --- Refresh Token Methods ---

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  // --- Combined Methods ---

  removeAllTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}