import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../core/models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://your-api-url.com/api/auth';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
    }

    register(username: string, email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, {
            username,
            email,
            password
        });
    }
}