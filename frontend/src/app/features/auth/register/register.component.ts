import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  confirmPassword = '';
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error.set(null);

    // Validation
    if (!this.userData.username || !this.userData.email || !this.userData.password) {
      this.error.set('Please fill in all required fields');
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.userData.password.length < 8) {
      this.error.set('Password must be at least 8 characters long');
      return;
    }

    this.loading.set(true);

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error.set(err.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
