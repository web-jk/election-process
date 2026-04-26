import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { Router } from '@angular/router';
import * as firebaseAuth from 'firebase/auth';

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({}))
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn()
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn()
}));

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /map on successful login', async () => {
    (firebaseAuth.signInWithPopup as any).mockResolvedValue({});
    
    await component.loginWithGoogle();
    
    expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/map']);
  });

  it('should handle login failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    (firebaseAuth.signInWithPopup as any).mockRejectedValue(new Error('Login failed'));
    
    await component.loginWithGoogle();
    
    expect(consoleSpy).toHaveBeenCalledWith('Login failed', expect.any(Error));
    expect(alertSpy).toHaveBeenCalledWith('Login failed. Check console for details.');
    
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('should handle continueAsGuest correctly', async () => {
    (firebaseAuth.signOut as any).mockResolvedValue({});
    
    await component.continueAsGuest();
    
    expect(firebaseAuth.signOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/map']);
  });

  it('should log error if signOut fails in continueAsGuest', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (firebaseAuth.signOut as any).mockRejectedValue(new Error('Sign out error'));
    
    await component.continueAsGuest();
    
    expect(consoleSpy).toHaveBeenCalledWith('Sign out failed', expect.any(Error));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/map']); // Should still navigate
    
    consoleSpy.mockRestore();
  });
});
