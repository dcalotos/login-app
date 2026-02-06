import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user = signal<User | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading.set(true);
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user.set(user);
        this.authService.currentUser.set(user);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load user profile');
        this.loading.set(false);
      }
    });
  }

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout error:', err);
          // Even if the API call fails, clear local storage and redirect
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }
}
