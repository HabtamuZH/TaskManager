import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { AuthService } from './services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'TaskManagerUI';
  showNavbar = false;
  showFooter = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Check initial authentication state
    this.updateNavigationVisibility();

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateNavigationVisibility();
      });

    // Listen to authentication state changes
    this.authService.isAuthenticated$.subscribe(() => {
      this.updateNavigationVisibility();
    });
  }

  private updateNavigationVisibility() {
    const isAuthenticated = this.authService.isAuthenticated();
    const currentRoute = this.router.url;

    // Show navbar and footer only when authenticated and not on auth pages
    this.showNavbar = isAuthenticated && !this.isAuthRoute(currentRoute);
    this.showFooter = isAuthenticated && !this.isAuthRoute(currentRoute);
  }

  private isAuthRoute(route: string): boolean {
    return route.includes('/login') || route.includes('/register');
  }
}
