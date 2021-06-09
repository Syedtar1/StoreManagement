import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _registerUrl = 'http://localhost:3000/api/register';
  private _loginUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient, private _router: Router) {}

  //Register API
  register(user: any) {
    return this.http.post<any>(this._registerUrl, user);
  }

  //Login API
  login(user: any) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('IsLayout');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');
    localStorage.removeItem('usertype');
    localStorage.removeItem('active');
    localStorage.removeItem('snapid');
    this._router.navigate(['/login']);
    window.location.reload();
  }

  showHideLayout() {
    return localStorage.getItem('IsLayout');
  }
}
