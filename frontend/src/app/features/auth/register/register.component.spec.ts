import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
  });

  it('should validate required fields', () => {
    expect(component.registerForm.valid).toBeFalse();
    
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalse();
  });

  it('should validate username length', () => {
    const usernameControl = component.registerForm.get('username');
    
    usernameControl?.setValue('ab');
    expect(usernameControl?.hasError('minlength')).toBeTrue();
    
    usernameControl?.setValue('abc');
    expect(usernameControl?.hasError('minlength')).toBeFalse();
  });

  it('should validate password length', () => {
    const passwordControl = component.registerForm.get('password');
    
    passwordControl?.setValue('short');
    expect(passwordControl?.hasError('minlength')).toBeTrue();
    
    passwordControl?.setValue('longenough');
    expect(passwordControl?.hasError('minlength')).toBeFalse();
  });

  it('should call authService.register on valid form submission', () => {
    const mockResponse = {
      message: 'User registered successfully'
    };
    
    authService.register.and.returnValue(of(mockResponse));
    
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    component.onSubmit();
    
    expect(authService.register).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
  });

  it('should navigate to login on successful registration', () => {
    const mockResponse = {
      message: 'User registered successfully'
    };
    
    authService.register.and.returnValue(of(mockResponse));
    
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display error message on failed registration', () => {
    const errorResponse = {
      error: { message: 'Username already exists' }
    };
    
    authService.register.and.returnValue(throwError(() => errorResponse));
    
    component.registerForm.patchValue({
      username: 'existinguser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Username already exists');
    expect(component.isLoading).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.patchValue({
      username: 'te', // Too short
      email: 'invalid',
      password: 'short'
    });
    
    component.onSubmit();
    
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should set loading state during registration', () => {
    authService.register.and.returnValue(of({ message: 'Success' }));
    
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(component.isLoading).toBe(false);
    component.onSubmit();
    expect(component.isLoading).toBe(false); // Returns to false after completion
  });
});
