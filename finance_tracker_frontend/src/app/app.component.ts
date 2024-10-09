// src/app/app.component.ts
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';  // Import Sidenav module
import { MatToolbarModule } from '@angular/material/toolbar';  // Toolbar module
import { MatListModule } from '@angular/material/list';        // List module for menu items
import { MatIconModule } from '@angular/material/icon';        // Icons module
import { MatButtonModule } from '@angular/material/button';    // Buttons module
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';                // Router module

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
