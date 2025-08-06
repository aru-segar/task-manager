import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreeTerms = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  register(event?: Event): void {
    if (event) event.preventDefault();

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errorMessage = 'Enter a valid email.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.agreeTerms) {
      this.errorMessage = 'You must agree to the terms.';
      return;
    }

    this.loading = true;

    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.auth.register(newUser).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.successMessage = `Welcome, ${response.user.username}! Redirecting...`;
        this.loading = false;

        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }

  getPasswordStrength(): string {
    if (this.password.length < 6) return 'Weak';
    if (/[A-Z]/.test(this.password) && /\d/.test(this.password) && this.password.length >= 8) return 'Strong';
    return 'Medium';
  }

  // getPasswordStrengthClass(): string {
  //   const strength = this.getPasswordStrength();
  //   return {
  //     'Weak': 'text-red-400',
  //     'Medium': 'text-yellow-400',
  //     'Strong': 'text-green-400'
  //   }[strength] || '';
  // }

  resetForm(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.agreeTerms = false;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
