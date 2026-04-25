import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  constructor(private router: Router) {}

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      this.router.navigate(['/map']);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Check console for details.');
    }
  }

  async continueAsGuest() {
    try {
      // Explicitly sign out to clear any previously saved login session
      await signOut(auth);
    } catch (error) {
      console.error('Sign out failed', error);
    }
    this.router.navigate(['/map']);
  }
}
