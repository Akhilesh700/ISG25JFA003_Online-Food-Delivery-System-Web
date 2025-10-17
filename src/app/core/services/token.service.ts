import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  // Use the key from the environment file instead of a hardcoded string
  private readonly TOKEN_KEY = environment.tokenKey;

  constructor() { }

  /**
   * Saves the authentication token to local storage.
   * @param token The JWT token string to save.
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Retrieves the authentication token from local storage.
   * @returns The token string, or null if it't doesn't exist.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getBearerToken(): string | null {
    return localStorage.getItem(`Bearer ${this.TOKEN_KEY}`);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    // Token not found
    if (!token) {
      return true;
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);

      const expirationDate = decodedToken.exp * 1000;
      const now = Date.now();

      return expirationDate < now;
      
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }
}

