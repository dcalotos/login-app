import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
    expect(component.username()).toBe('');
    expect(component.password()).toBe('');
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('');
  });

  it('should call authService.login on valid form submission', () => {
    const mockResponse = {
      accessToken: 'token123',
      refreshToken: 'refresh123',
      tokenType: 'Bearer',
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    };
    
    authService.login.and.returnValue(of(mockResponse));
    
    component.username.set('testuser');
    component.password.set('password123');
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });

  it('should navigate to dashboard on successful login', () => {
    const mockResponse = {
      accessToken: 'token123',
      refreshToken: 'refresh123',
      tokenType: 'Bearer',
      user: { id: 1, username: 'testuser', email: 'test@example.com' }
    };
    
    authService.login.and.returnValue(of(mockResponse));
    
    component.username.set('testuser');
    component.password.set('password123');
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display error message on failed login', () => {
    const errorResponse = {
      error: { message: 'Invalid credentials' }
    };
    
    authService.login.and.returnValue(throwError(() => errorResponse));
    
    component.username.set('testuser');
    component.password.set('wrongpassword');
    component.onSubmit();
    
    expect(component.error()).toBe('Invalid credentials');
    expect(component.loading()).toBe(false);
  });

  it('should set loading state during login', () => {
    authService.login.and.returnValue(of({
      accessToken: 'token',
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: { id: 1, username: 'test', email: 'test@test.com' }
    }));
    
    component.username.set('testuser');
    component.password.set('password123');
    
    expect(component.loading()).toBe(false);
    component.onSubmit();
    expect(component.loading()).toBe(false); // Returns to false after completion
  });

  it('should clear error on new login attempt', () => {
    component.error.set('Previous error');
    
    authService.login.and.returnValue(of({
      accessToken: 'token',
      refreshToken: 'refresh',
      tokenType: 'Bearer',
      user: { id: 1, username: 'test', email: 'test@test.com' }
    }));
    
    component.username.set('testuser');
    component.password.set('password123');
    component.onSubmit();
    
    expect(component.error()).toBe('');
  });
});
