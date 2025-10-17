import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from '@shared/components/navbar/navbar';
import { DarkModeService } from '@shared/services/darkmode.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly darkmodeService = inject(DarkModeService);
  private readonly router = inject(Router);


  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }


  showNavBar() : boolean {
    return this.router.url.includes('user');
  }



}
