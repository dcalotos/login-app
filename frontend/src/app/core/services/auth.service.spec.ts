import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request and store tokens', () => {
      const mockResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        tokenType: 'Bearer',
        user: { id: 1, username: 'testuser', email: 'test@example.com' }
      };

      service.login({ username: 'testuser', password: 'password123' }).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('accessToken')).toBe('test-access-token');
        expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token');
        expect(service.currentUser()?.username).toBe('testuser');
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
      req.flush(mockResponse);
    });
  });

  describe('register', () => {
    it('should send registration request', () => {
      const mockRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };
      const mockResponse = { message: 'User registered successfully' };

      service.register(mockRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should send logout request and clear tokens', () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');
      service.currentUser.set({ id: 1, username: 'test', email: 'test@test.com' });

      service.logout().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(service.currentUser()).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should send refresh token request', () => {
      localStorage.setItem('refreshToken', 'old-refresh-token');
      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer'
      };

      service.refreshToken().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('accessToken')).toBe('new-access-token');
        expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'old-refresh-token' });
      req.flush(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user', () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };

      service.getCurrentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(service.currentUser()).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password request', () => {
      const mockResponse = { message: 'Password reset email sent' };

      service.forgotPassword('test@example.com').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com' });
      req.flush(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should send reset password request', () => {
      const mockResponse = { message: 'Password reset successfully' };

      service.resetPassword('test-token', 'newpassword123').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: 'test-token', newPassword: 'newpassword123' });
      req.flush(mockResponse);
    });
  });

  describe('validateResetToken', () => {
    it('should validate reset token', () => {
      const mockResponse = { message: 'Token is valid' };

      service.validateResetToken('test-token').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/validate-reset-token?token=test-token`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorage.setItem('accessToken', 'test-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when no access token', () => {
      localStorage.removeItem('accessToken');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      localStorage.setItem('accessToken', 'test-token');
      expect(service.getAccessToken()).toBe('test-token');
    });

    it('should return null when no token', () => {
      expect(service.getAccessToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      localStorage.setItem('refreshToken', 'test-refresh');
      expect(service.getRefreshToken()).toBe('test-refresh');
    });

    it('should return null when no refresh token', () => {
      expect(service.getRefreshToken()).toBeNull();
    });
  });
});
