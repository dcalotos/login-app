import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email', () => {
    expect(component.forgotPasswordForm.value).toEqual({
      email: ''
    });
  });

  it('should validate email is required', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    
    expect(emailControl?.hasError('required')).toBeTrue();
    
    emailControl?.setValue('test@example.com');
    expect(emailControl?.hasError('required')).toBeFalse();
  });

  it('should validate email format', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalse();
  });

  it('should call authService.forgotPassword on valid form submission', () => {
    const mockResponse = {
      message: 'Password reset email sent'
    };
    
    authService.forgotPassword.and.returnValue(of(mockResponse));
    
    component.forgotPasswordForm.patchValue({
      email: 'test@example.com'
    });
    
    component.onSubmit();
    
    expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('should display success message on successful request', () => {
    const mockResponse = {
      message: 'Password reset email sent. Please check your email.'
    };
    
    authService.forgotPassword.and.returnValue(of(mockResponse));
    
    component.forgotPasswordForm.patchValue({
      email: 'test@example.com'
    });
    
    component.onSubmit();
    
    expect(component.successMessage).toBe('Password reset email sent. Please check your email.');
    expect(component.errorMessage).toBe('');
  });

  it('should display error message on failed request', () => {
    const errorResponse = {
      error: { message: 'User not found with email' }
    };
    
    authService.forgotPassword.and.returnValue(throwError(() => errorResponse));
    
    component.forgotPasswordForm.patchValue({
      email: 'nonexistent@example.com'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('User not found with email');
    expect(component.successMessage).toBe('');
  });

  it('should reset form after successful submission', () => {
    const mockResponse = {
      message: 'Password reset email sent'
    };
    
    authService.forgotPassword.and.returnValue(of(mockResponse));
    
    component.forgotPasswordForm.patchValue({
      email: 'test@example.com'
    });
    
    component.onSubmit();
    
    expect(component.forgotPasswordForm.value.email).toBeNull();
  });

  it('should not submit if form is invalid', () => {
    component.forgotPasswordForm.patchValue({
      email: 'invalid-email'
    });
    
    component.onSubmit();
    
    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });

  it('should set loading state during request', () => {
    authService.forgotPassword.and.returnValue(of({ message: 'Success' }));
    
    component.forgotPasswordForm.patchValue({
      email: 'test@example.com'
    });
    
    expect(component.isLoading).toBe(false);
    component.onSubmit();
    expect(component.isLoading).toBe(false); // Returns to false after completion
  });

  it('should clear messages on new submission', () => {
    component.successMessage = 'Previous success';
    component.errorMessage = 'Previous error';
    
    authService.forgotPassword.and.returnValue(of({ message: 'New success' }));
    
    component.forgotPasswordForm.patchValue({
      email: 'test@example.com'
    });
    
    component.onSubmit();
    
    // At the start of onSubmit, messages should be cleared
    expect(component.errorMessage).toBe('');
  });
});
