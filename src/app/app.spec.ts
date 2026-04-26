import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { ChatbotComponent } from './chatbot/chatbot';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let routerEvents: Subject<any>;
  let mockRouter: any;

  beforeEach(async () => {
    routerEvents = new Subject<any>();
    mockRouter = {
      events: routerEvents.asObservable(),
      url: '/',
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoginPage to true if initial URL contains /login', () => {
    // Reset component with different initial URL
    mockRouter.url = '/login';
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    expect((component as any).isLoginPage()).toBe(true);
  });

  it('should update isLoginPage on NavigationEnd events', () => {
    expect((component as any).isLoginPage()).toBe(false);

    routerEvents.next(new NavigationEnd(1, '/login', '/login'));
    fixture.detectChanges();
    expect((component as any).isLoginPage()).toBe(true);

    routerEvents.next(new NavigationEnd(2, '/map', '/map'));
    fixture.detectChanges();
    expect((component as any).isLoginPage()).toBe(false);
  });

  it('should have correct title signal', () => {
    expect((component as any).title()).toBe('election-process');
  });
});
