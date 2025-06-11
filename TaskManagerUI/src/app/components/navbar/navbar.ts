import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  isMenuOpen = false;
  isMobileMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.updateMobileMenuState();
    window.addEventListener('resize', () => this.updateMobileMenuState());
  }

  updateMobileMenuState() {
    this.isMobileMenu = window.innerWidth <= 960;
    if (!this.isMobileMenu) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstNameInitial = this.currentUser.firstName
      ? this.currentUser.firstName.charAt(0)
      : '';
    const lastNameInitial = this.currentUser.lastName
      ? this.currentUser.lastName.charAt(0)
      : '';
    return (firstNameInitial + lastNameInitial).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }
}
