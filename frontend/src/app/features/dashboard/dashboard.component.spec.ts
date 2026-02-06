import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getCurrentUser'], {
      currentUser: signal({ id: 1, username: 'testuser', email: 'test@example.com' })
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current user information', () => {
    expect(component.user()).toEqual({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    });
  });

  it('should call logout on logout button click', () => {
    authService.logout.and.returnValue(of(void 0));
    
    component.onLogout();
    
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should navigate to login after successful logout', () => {
    authService.logout.and.returnValue(of(void 0));
    
    component.onLogout();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should have user signal from auth service', () => {
    const userSignal = authService.currentUser;
    expect(userSignal()).toBeDefined();
    expect(userSignal()?.username).toBe('testuser');
  });
});
