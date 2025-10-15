import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '@shared/components/navbar/navbar';
import { DarkModeService } from '@shared/services/darkmode.service';
import { Footer } from "@shared/components/footer/footer";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly darkmodeService = inject(DarkModeService);



  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }


  onAuthPage() : boolean {
    return window.location.href.includes('auth');
  }




}
