import { Component } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";

@Component({
  selector: 'app-user-options-sheet',
  imports: [ZardBreadcrumbModule],
  templateUrl: './user-options-sheet.html',
  styleUrl: './user-options-sheet.css'
})
export class UserOptionsSheet {


  currentUser = {
    userId: '123',
    name: 'Eren Yeager',
    avatarUrl: 'https://i.pinimg.com/originals/d4/69/49/d469498d11bed69e289d8dacc8b7eae9.jpg',
    location: 'Coimbatore, In'
  }


}
