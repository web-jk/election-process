import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('election-process');
  protected isLoginPage = signal(false);

  constructor() {
    const router = inject(Router);
    // Initialize state
    this.isLoginPage.set(router.url.includes('/login'));
    
    // Listen for navigation changes
    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage.set(event.urlAfterRedirects.includes('/login'));
    });
  }
}
