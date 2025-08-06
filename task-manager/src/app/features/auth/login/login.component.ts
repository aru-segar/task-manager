import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  errorMessage = '';
  loading = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(event?: Event): void {
    if (event) event.preventDefault();

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.loading = true;

    setTimeout(() => {
      const mockUser = {
        id: 'user-001',
        username: 'Aruniga',
        email: this.email,
        createdAt: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));

      this.loading = false;
      location.href = '/';
    }, 1200);
  }
}
