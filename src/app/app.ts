import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '@shared/components/navbar/navbar';
import { DarkModeService } from '@shared/services/darkmode.service';
import { GlobalLoaderComponent } from "@shared/components/global-loader/global-loader.component";
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, GlobalLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly darkmodeService = inject(DarkModeService);

private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  constructor() {
    // Start listening to router events as soon as the component is created.
    this.listenToRouterEvents();
  }

  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }


  onAuthPage() : boolean {
    return window.location.href.includes('auth');
  }
  onLandingPage() : boolean {
    return window.location.href.includes('/');
  }


  private listenToRouterEvents(): void {
    this.router.events.pipe(
      // Use takeUntilDestroyed() for automatic subscription cleanup. This is a modern best practice.
      takeUntilDestroyed()
    ).subscribe(event => {
      // When a navigation starts (e.g., clicking a link for a lazy-loaded component), show the loader.
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } 
      // When the navigation is complete, has been canceled, or has failed, hide the loader.
      else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
  }

}
