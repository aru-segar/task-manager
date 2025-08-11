import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable()
export class UnwrapResponseInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(event => {
                if (event instanceof HttpResponse) {
                    const body = event.body;
                    if (body && typeof body === 'object' && 'success' in body) {
                        const api = body as ApiResponse<any>;
                        if (api.success) return event.clone({ body: api.data });
                    }
                }
                return event;
            })
        );
    }
}
