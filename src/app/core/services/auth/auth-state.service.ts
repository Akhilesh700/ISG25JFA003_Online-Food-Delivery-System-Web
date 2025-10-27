// src/app/core/services/auth/auth-state.service.ts
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Role } from './auth.models'; // Assuming auth.models defines the Role type

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  // --- State Signals ---

  // Storing the current user's role privately using a signal.
  private readonly _userRole = signal<Role>(null);
  // Exposing the user role signal publicly as a readonly signal to prevent external modification.
  public readonly userRole = this._userRole.asReadonly();
  // Exposing the user role as an observable for reactive programming patterns.
  public readonly userRole$ = toObservable(this._userRole);

  // Storing the resolution status of the initial authentication check privately.
  private readonly _isAuthStateResolved = signal<boolean>(false);
  // Exposing the resolution status publicly as a readonly signal.
  public readonly isAuthStateResolved = this._isAuthStateResolved.asReadonly();
  // Exposing the resolution status as an observable.
  public readonly isAuthStateResolved$ = toObservable(this._isAuthStateResolved);

  // --- State Modifiers ---

  /**
   * Setting both the user role and the resolved status simultaneously.
   * @param role The user's role (or null if not authenticated).
   * @param isResolved Boolean indicating if the initial auth check is complete.
   */
  setAuthState(role: Role, isResolved: boolean): void {
    this._userRole.set(role);
    this._isAuthStateResolved.set(isResolved);
  }

  /**
   * Setting only the resolved status, typically used during async operations.
   * @param isResolved Boolean indicating if the auth check is complete.
   */
  setResolved(isResolved: boolean): void {
    this._isAuthStateResolved.set(isResolved);
  }

  /**
   * Clearing the authentication state, typically used during logout.
   * Sets the user role to null and marks the state as resolved (as logged out).
   */
  clearAuthState(): void {
    this._userRole.set(null);
    this._isAuthStateResolved.set(true); // Setting state as resolved, indicating a logged-out status.
  }
}