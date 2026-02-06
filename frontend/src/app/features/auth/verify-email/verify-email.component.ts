import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  isVerifying = true;
  verificationSuccess = false;
  errorMessage = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.verifyEmail();
      } else {
        this.isVerifying = false;
        this.errorMessage = 'Invalid verification link.';
      }
    });
  }

  verifyEmail(): void {
    this.http.post<any>(`${environment.apiUrl}/auth/verify-email?token=${this.token}`, {})
      .subscribe({
        next: (response) => {
          this.isVerifying = false;
          this.verificationSuccess = true;
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isVerifying = false;
          this.verificationSuccess = false;
          this.errorMessage = error.error?.message || 'Email verification failed. The link may be invalid or expired.';
        }
      });
  }
}
