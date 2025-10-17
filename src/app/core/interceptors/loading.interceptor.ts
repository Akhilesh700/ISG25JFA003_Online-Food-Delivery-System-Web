import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Intercepts all outgoing HTTP requests to manage the global loading state.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  /**
   * Intercepts an outgoing HTTP request and shows the loader. Hides the loader
   * when the request is complete (either success or error).
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show the loader for every request.
    this.loadingService.show();

    // The `finalize` operator guarantees that the `hide()` method will be called
    // upon completion of the request, regardless of its outcome.
    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}