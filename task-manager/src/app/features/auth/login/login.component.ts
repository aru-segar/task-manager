import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  login() {
    if (!this.email || !this.password) return;

    // Temporary mock login 
    const mockUser = {
      id: 'user-001',
      username: 'Aruniga',
      email: this.email,
      createdAt: new Date()
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    alert('Logged in as ' + mockUser.username);
    location.href = '/'; // redirect to task manager
  }
}
