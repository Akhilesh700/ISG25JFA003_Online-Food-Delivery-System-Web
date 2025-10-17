import { Injectable, signal } from '@angular/core';

/**
 * Manages the global loading state of the application.
 * It tracks the number of active HTTP requests to determine if a loader should be displayed.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private readonly _isLoading = signal<boolean>(false);

  /**
   * A read-only signal that components can use to react to loading state changes.
   */
  public readonly isLoading = this._isLoading.asReadonly();

  /**
   * Shows the loading indicator.
   * This method is called by the interceptor when a new HTTP request starts.
   */
  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      // Only set to true on the first request to avoid unnecessary signal updates.
      this._isLoading.set(true);
    }
  }

  /**
   * Hides the loading indicator.
   * This method is called by the interceptor when an HTTP request completes or fails.
   */
  hide(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0; // Prevent the counter from going negative.
      this._isLoading.set(false);
    }
  }
}