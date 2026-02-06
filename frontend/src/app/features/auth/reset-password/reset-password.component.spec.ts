import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword', 'validateResetToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    activatedRoute = {
      queryParams: of({ token: 'test-token-123' })
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    authService.validateResetToken.and.returnValue(of({ message: 'Token is valid' }));
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.resetPasswordForm.value).toEqual({
      newPassword: '',
      confirmPassword: ''
    });
  });

  it('should validate token on init', () => {
    expect(authService.validateResetToken).toHaveBeenCalledWith('test-token-123');
    expect(component.tokenValid).toBeTrue();
    expect(component.checkingToken).toBeFalse();
  });

  it('should handle invalid token', () => {
    authService.validateResetToken.and.returnValue(throwError(() => ({ error: { message: 'Invalid token' } })));
    
    component.ngOnInit();
    
    expect(component.tokenValid).toBeFalse();
    expect(component.errorMessage).toBe('This password reset link is invalid or has expired.');
  });

  it('should validate password is required', () => {
    const passwordControl = component.resetPasswordForm.get('newPassword');
    
    expect(passwordControl?.hasError('required')).toBeTrue();
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.hasError('required')).toBeFalse();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.resetPasswordForm.get('newPassword');
    
    passwordControl?.setValue('short');
    expect(passwordControl?.hasError('minlength')).toBeTrue();
    
    passwordControl?.setValue('longenough');
    expect(passwordControl?.hasError('minlength')).toBeFalse();
  });

  it('should validate passwords match', () => {
    component.resetPasswordForm.patchValue({
      newPassword: 'password123',
      confirmPassword: 'different123'
    });
    
    const confirmControl = component.resetPasswordForm.get('confirmPassword');
    expect(confirmControl?.hasError('mismatch')).toBeTrue();
  });

  it('should pass validation when passwords match', () => {
    component.resetPasswordForm.patchValue({
      newPassword: 'password123',
      confirmPassword: 'password123'
    });
    
    const confirmControl = component.resetPasswordForm.get('confirmPassword');
    expect(confirmControl?.hasError('mismatch')).toBeFalsy();
  });

  it('should call authService.resetPassword on valid form submission', () => {
    const mockResponse = {
      message: 'Password has been reset successfully'
    };
    
    authService.resetPassword.and.returnValue(of(mockResponse));
    
    component.resetPasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    });
    
    component.onSubmit();
    
    expect(authService.resetPassword).toHaveBeenCalledWith('test-token-123', 'newpassword123');
  });

  it('should display success message and redirect to login', (done) => {
    const mockResponse = {
      message: 'Password has been reset successfully'
    };
    
    authService.resetPassword.and.returnValue(of(mockResponse));
    
    component.resetPasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    });
    
    component.onSubmit();
    
    expect(component.successMessage).toBe('Password has been reset successfully');
    
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }, 2100);
  });

  it('should display error message on failed reset', () => {
    const errorResponse = {
      error: { message: 'Token expired' }
    };
    
    authService.resetPassword.and.returnValue(throwError(() => errorResponse));
    
    component.resetPasswordForm.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Token expired');
    expect(component.isLoading).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.resetPasswordForm.patchValue({
      newPassword: 'short',
      confirmPassword: 'different'
    });
    
    component.onSubmit();
    
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  it('should handle missing token in URL', () => {
    activatedRoute.queryParams = of({});
    
    component.ngOnInit();
    
    expect(component.checkingToken).toBeFalse();
    expect(component.errorMessage).toBe('Invalid password reset link.');
  });
});
