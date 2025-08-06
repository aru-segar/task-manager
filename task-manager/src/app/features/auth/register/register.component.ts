import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): string {
    if (this.password.length < 6) return 'Weak';
    if (/[A-Z]/.test(this.password) && /\d/.test(this.password) && this.password.length >= 8) return 'Strong';
    return 'Medium';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    return {
      'Weak': 'text-red-400',
      'Medium': 'text-yellow-400',
      'Strong': 'text-green-400'
    }[strength] || '';
  }

  register(event?: Event): void {
    if (event) event.preventDefault();

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.agreeTerms) {
      this.errorMessage = 'You must agree to the terms to register.';
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.email === this.email)) {
      this.errorMessage = 'User already registered with this email.';
      return;
    }

    this.loading = true;

    const newUser = {
      id: 'user-' + Math.floor(Math.random() * 1000),
      username: this.username,
      email: this.email,
      createdAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    setTimeout(() => {
      this.successMessage = `Registered as ${newUser.username}! Redirecting...`;
      this.loading = false;

      setTimeout(() => {
        location.href = '/';
      }, 1500);
    }, 1200);
  }

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