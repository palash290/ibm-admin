import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  baseUrl = 'http://192.168.29.76:8000/api/';
  //baseUrl = 'http://89.116.21.92:4010/api/';

  constructor(private http: HttpClient, private route: Router) { }

  setToken(token: string) {
    sessionStorage.setItem('ibsAdminToken', token)
  }

  getToken() {
    return sessionStorage.getItem('ibsAdminToken')
  }

  isLogedIn() {
    return this.getToken() !== null
  }

  logout() {
    sessionStorage.removeItem('ibsAdminToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('agentId');
    localStorage.clear();
    sessionStorage.clear();
    this.route.navigateByUrl('');
  }

  loginUser(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    return this.http.post<any>(this.baseUrl + 'sub-admin/login', params, {
      headers: headers
    })
  }

  // getApi(url: any): Observable<any> {
  //   const authToken = localStorage.getItem('ibsAdminToken')
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${authToken}`
  //   })
  //   return this.http.get(this.baseUrl + url, { headers: headers })
  // }

  getApi(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url, { headers: this.getHeaders('application/json') }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  postAPI(url: any, data: any): Observable<any> {
    const authToken = sessionStorage.getItem('ibsAdminToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${authToken}`
    })
    return this.http.post(this.baseUrl + url, data, { headers: headers })
  }

  postData(url: any, data: any): Observable<any> {
    const authToken = sessionStorage.getItem('ibsAdminToken')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    })
    return this.http.post(this.baseUrl + url, data, { headers: headers })
  }

  postAPIFormData(url: any, data: any): Observable<any> {
    const authToken = sessionStorage.getItem('ibsAdminToken')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    })
    return this.http.post(this.baseUrl + url, data, { headers: headers })
  }

  putAPIFormData(url: any, data: any): Observable<any> {
    const authToken = sessionStorage.getItem('ibsAdminToken')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    })
    return this.http.put(this.baseUrl + url, data, { headers: headers })
  }

  deleteAcc(url: any): Observable<any> {
    const authToken = sessionStorage.getItem('ibsAdminToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete(this.baseUrl + url, { headers: headers })
  };

  //start//
  private getHeaders(contentType: string): HttpHeaders {
    const authToken = sessionStorage.getItem('ibsAdminToken') || '';
    return new HttpHeaders({
      'Content-Type': contentType,
      Authorization: `Bearer ${authToken}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.handleUnauthorizedError();
    }
    return throwError(() => error);
  }

  private handleUnauthorizedError(): void {
    sessionStorage.removeItem('ibsAdminToken');
    this.route.navigate(['']);
  }
  //end//


  private refreshSidebarSource = new BehaviorSubject<void | null>(null);
  refreshSidebar$ = this.refreshSidebarSource.asObservable();

  triggerRefresh() {
    this.refreshSidebarSource.next(null);
  }


}
