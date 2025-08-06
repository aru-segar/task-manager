import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Navbar } from "./shared/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
 }