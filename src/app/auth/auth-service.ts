import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';


interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private _isLoggedIn = signal(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  private users: User[] = [
    { username: 'a@g.com', password: 'a@123' }
  ];
  
  constructor(private router: Router) {}

  register(username: string, password: string): boolean {
    const existingUser = this.users.find((u) => u.username === username)
    if (existingUser) return false;
    this.users.push({username, password})
    return true;
  }

  login(username: string, password: string): boolean {
    const foundUser = this.users.find(u => u.username === username && u.password === password)
    if (foundUser) {
      this._isLoggedIn.set(true);
      this.router.navigate(['/home']);
      return true;
    }
    return false;
  }

  logout() {
    this._isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
