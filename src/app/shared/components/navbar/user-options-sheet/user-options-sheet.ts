import { Component, inject, OnInit } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { Z_MODAL_DATA } from '@shared/components/sheet/sheet.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { IUserResponse } from 'src/app/core/services/customer/user-profile/user-profile.service';
import { OptionSheetData } from '../navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-options-sheet',
  imports: [ZardBreadcrumbModule, RouterLink],
  templateUrl: './user-options-sheet.html',
  styleUrl: './user-options-sheet.css'
})
export class UserOptionsSheet implements OnInit {
  private authService = inject(AuthService)
  private zData: OptionSheetData = inject(Z_MODAL_DATA);

  user!: IUserResponse | undefined;

  constructor() {
    if(this.zData) {
      const self = this;
      this.zData.user.subscribe({
        next(value) {
            self.user = value;
            console.log(value)
        },
      })
    }
  }

  ngOnInit(): void {
      this.currentUser = {
      userId: this.user?.email ? this.user.email : '1',
      name: this.user?.name ? this.user.name : 'Eren Yeager',
      avatarUrl: '/img/avatar/user_profile.png',
      location: this.user?.address ? this.user.address  : 'Coimbatore, In'
    }    
  }

  currentUser = {
    userId: this.user ? this.user.email : '1',
    name: this.user ? this.user.name : 'Eren Yeager',
    avatarUrl: 'img/avatar/user.png',
    location: this.user ? this.user.address  : 'Coimbatore, In'
  }

  handleLogout(){
    this.authService.logout();

  }

}
