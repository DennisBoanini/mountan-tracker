import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'activities',
    pathMatch: 'full',
  },
  {
    path: 'activities',
    loadComponent: () =>
      import('./features/activity-list/activity-list.component').then(
        (m) => m.ActivityListComponent
      ),
  },
  {
    path: 'activities/:id',
    loadComponent: () =>
      import('./features/activity-detail/activity-detail.component').then(
        (m) => m.ActivityDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'activities',
  },
];
