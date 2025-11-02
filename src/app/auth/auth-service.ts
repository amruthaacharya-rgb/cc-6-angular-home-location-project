import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = signal(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly;

  constructor(private router : Router){}

  login(username : string, password: string): boolean {
    if (username === "admin" && password === "admin@123"){
      this._isLoggedIn.set(true);
      this.router.navigate(['/home'])
      return true;
    }
    return false;
  }

  logout(){
    this._isLoggedIn.set(false);
      this.router.navigate(['/login'])
  }
  
}
