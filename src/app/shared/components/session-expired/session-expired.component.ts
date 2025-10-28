import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css']
})
export class SessionExpiredComponent implements OnInit {

  private authService = inject(AuthService)
  private router = inject(Router)

  ngOnInit() {
    toast.error("Redirecting to login!")
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    },3000)
  }

}
