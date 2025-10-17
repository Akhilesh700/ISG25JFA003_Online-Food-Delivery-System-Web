import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    LoginFormComponent,
    ZardCardComponent,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
