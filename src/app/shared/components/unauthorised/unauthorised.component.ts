import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-unauthorised',
  templateUrl: './unauthorised.component.html',
  styleUrls: ['./unauthorised.component.css']
})
export class UnauthorisedComponent implements OnInit {
  private router = inject(Router)
  private authService = inject(AuthService)
  
  ngOnInit() {
    toast.error("You are not authorised to access this!")
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    },3000)
  }

}
