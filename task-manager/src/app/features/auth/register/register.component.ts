import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  register(): void {
    if (!this.username || !this.email || !this.password) return;

    // TEMPORARY MOCK register
    const newUser = {
      id: 'user-' + Math.floor(Math.random() * 1000),
      username: this.username,
      email: this.email,
      createdAt: new Date()
    };

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    alert('Registered as ' + newUser.username);
    location.href = '/'; // redirect to task manager (home)
  }
}
