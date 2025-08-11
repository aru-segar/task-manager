import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

export interface NormalizedError {
  code?: number;
  message: string;
  details?: Record<string, string[]>;
  raw?: any;
}

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(private notify: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: any) => {
        const normalized = this.normalize(err);
        this.notify.show(this.forToast(normalized));
        return throwError(() => normalized);
      })
    );
  }

  private normalize(err: any): NormalizedError {
    if (err instanceof HttpErrorResponse) {
      const payload = err.error;
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const e = payload.error || {};
        return {
          code: e.code ?? err.status,
          message: e.message ?? 'Something went wrong.',
          details: e.details,
          raw: err
        };
      }
      return {
        code: err.status,
        message: (payload && payload.message) || err.statusText || 'Request failed.',
        raw: err
      };
    }
    return { message: 'Unexpected error.', raw: err };
  }

  private forToast(e: NormalizedError): string {
    if (e.details && Object.keys(e.details).length) {
      const field = Object.keys(e.details)[0];
      const msg = e.details[field][0];
      return `${e.message} — ${field}: ${msg}`;
    }
    return e.message;
  }
}
