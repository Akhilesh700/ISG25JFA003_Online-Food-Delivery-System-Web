import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "@shared/components/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [Navbar,RouterOutlet],
  templateUrl: './shell.html',
})
export class CustomerShell {

}