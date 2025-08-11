import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'] 
})
export class Navbar implements OnInit {
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('currentUser');

    // Safe-parse: handle null or the literal "undefined"
    if (raw && raw !== 'undefined') {
      try {
        this.currentUser = JSON.parse(raw);
      } catch {
        this.currentUser = null;
        localStorage.removeItem('currentUser'); 
      }
    } else {
      this.currentUser = null;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
