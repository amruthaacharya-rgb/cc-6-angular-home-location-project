import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  authForm!: FormGroup;
  isRegisterMode = false;
  error = '';
  showPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/[A-Z]/), 
          Validators.pattern(/[a-z]/), 
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[@$!%*?&]/), 
        ],
      ],
      confirmPassword: [''],
    });

    if (!this.isRegisterMode) {
      this.authForm.get('confirmPassword')?.clearValidators();
      this.authForm.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.initForm();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): 'Weak' | 'Medium' | 'Strong' | '' {
    const password = this.authForm.get('password')?.value || '';
    if (!password) return '';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const hasLength = password.length >= 8;
    const score = [hasUpper, hasLower, hasNum, hasSpecial, hasLength].filter(Boolean).length;
    if (score >= 5) return 'Strong';
    if (score >= 3) return 'Medium';
    return 'Weak';
  }

  submit() {
    const { email, password, confirmPassword } = this.authForm.value;
    if (this.isRegisterMode && this.getPasswordStrength() === 'Weak') {
      this.error =
        'Password is too weak. Include uppercase, lowercase, number, and special character.';
      return;
    }

    if (this.isRegisterMode && password !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (this.isRegisterMode) {
      const success = this.authService.register(email, password);
      if (!success) {
        this.error = 'User already exists.';
      } else {
        this.error = '';
        this.toastr.success('Registration successful! You can now log in.', 'Success');
        this.toggleMode();
      }
    } else {
      const success = this.authService.login(email, password);
      this.toastr.success('Login Successfull', 'Success');
      if (!success) {
        this.error = 'Invalid email or password.';
      }
    }

  }
}
