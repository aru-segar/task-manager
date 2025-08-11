import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Unwrap backend envelope so callers receive { token, user }
  login(credentials: any): Observable<{ token: string; user: any }> {
    return this.http.post(`${this.baseUrl}/login`, credentials, { withCredentials: true }).pipe(
      map((res: any) => {
        // backend shape: { success, data: { token, user }, error? }
        if (res && res.success && res.data) return res.data;
        // fallback if backend ever returns raw { token, user }
        return res?.data ?? res;
      })
    );
  }

  // Unwrap to { token, user } for consistency with login
  register(data: any): Observable<{ token: string; user: any }> {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      map((res: any) => {
        if (res && res.success && res.data) return res.data;
        return res?.data ?? res;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
