import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from 'src/app/core/services/loading.service';
// 1. Import the Lottie component and its configuration type.
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

/**
 * A global component that displays a Lottie animation overlay based on the LoadingService state.
 */
@Component({
  selector: 'app-global-loader',
  standalone: true,
  // 2. Add LottieComponent to your imports.
  imports: [CommonModule, LottieComponent],
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <ng-lottie
          [options]="lottieOptions"
          [height]="'300px'"
          [width]="'300px'">
        </ng-lottie>
      </div>
    }
  `
})
export class GlobalLoaderComponent {
  public loadingService = inject(LoadingService);
  
  /**
   * Configuration options for the Lottie animation player.
   * This points to the JSON file you downloaded.
   */
  public lottieOptions: AnimationOptions = {
    path: 'animation/Loading_Animation.json'
  };
}