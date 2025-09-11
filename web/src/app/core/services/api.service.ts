import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

type BodyOptions = {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  reportProgress?: boolean;
  withCredentials?: boolean;
  context?: HttpContext;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api'; // proxied to http://localhost:8080

  get<T>(url: string, options: BodyOptions = {}): Observable<T> {
    return this.http.get<T>(this.base + url, { ...options, observe: 'body' as const });
  }
  post<T>(url: string, body: any, options: BodyOptions = {}): Observable<T> {
    return this.http.post<T>(this.base + url, body, { ...options, observe: 'body' as const });
  }
  patch<T>(url: string, body: any, options: BodyOptions = {}): Observable<T> {
    return this.http.patch<T>(this.base + url, body, { ...options, observe: 'body' as const });
  }
}

