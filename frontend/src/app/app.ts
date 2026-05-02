import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button routerLink="/activities" aria-label="Home">
        <mat-icon>terrain</mat-icon>
      </button>
      <span class="toolbar-title" routerLink="/activities" style="cursor:pointer">Mountain Tracker</span>
      <span class="toolbar-spacer"></span>
    </mat-toolbar>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .toolbar-title {
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-left: 4px;
    }
    .toolbar-spacer {
      flex: 1;
    }
    .app-main {
      min-height: calc(100vh - 64px);
      background: #f5f5f5;
    }
  `],
})
export class AppComponent {}
