import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivityService } from '../../core/services/activity.service';
import { Activity } from '../../core/models/activity.model';
import { MetadataService } from '../../core/services/metadata.service';
import { ActivityFormDialogComponent } from '../../shared/components/activity-form-dialog.component';
import { MarkDoneDialogComponent } from '../../shared/components/mark-done-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private activityService = inject(ActivityService);
  protected meta = inject(MetadataService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  activity = signal<Activity | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.activityService.getById(id).subscribe({
      next: (a) => {
        this.activity.set(a);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Attività non trovata');
        this.loading.set(false);
      },
    });
  }

  typeLabel(type: string): string {
    return this.meta.activityTypeLabel(type);
  }

  guideLabel(gt: string | null): string {
    return this.meta.guideTypeLabel(gt);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  openLink(url: string | null): void {
    if (url) window.open(url, '_blank');
  }

  openEditDialog(): void {
    const ref = this.dialog.open(ActivityFormDialogComponent, {
      data: { activity: this.activity() },
      width: '500px',
    });
    ref.afterClosed().subscribe((result) => {
      if (!result || !this.activity()) return;
      this.activityService.update(this.activity()!.id, result).subscribe({
        next: (updated) => {
          this.activity.set(updated);
          this.snackBar.open('Attività aggiornata!', 'OK', { duration: 3000 });
        },
        error: () =>
          this.snackBar.open("Errore nell'aggiornamento", 'OK', { duration: 3000 }),
      });
    });
  }

  openMarkDoneDialog(): void {
    const ref = this.dialog.open(MarkDoneDialogComponent, {
      data: { activity: this.activity() },
      width: '460px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result === undefined || !this.activity()) return;
      this.activityService.markDone(this.activity()!.id, result).subscribe({
        next: (updated) => {
          this.activity.set(updated);
          this.snackBar.open('Ottimo! Attività completata 🎉', 'OK', { duration: 3000 });
        },
        error: () => this.snackBar.open('Errore', 'OK', { duration: 3000 }),
      });
    });
  }

  undoMarkDone(): void {
    if (!this.activity()) return;
    this.activityService.markUndone(this.activity()!.id).subscribe({
      next: (updated) => {
        this.activity.set(updated);
        this.snackBar.open('Completamento annullato', 'OK', { duration: 3000 });
      },
      error: () => this.snackBar.open('Errore', 'OK', { duration: 3000 }),
    });
  }

  deleteActivity(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Elimina attività',
        message: `Sei sicuro di voler eliminare "${this.activity()?.title}"?`,
        confirmLabel: 'Elimina',
        confirmColor: 'warn',
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed || !this.activity()) return;
      this.activityService.delete(this.activity()!.id).subscribe({
        next: () => {
          this.snackBar.open('Attività eliminata', 'OK', { duration: 3000 });
          this.router.navigate(['/activities']);
        },
        error: () =>
          this.snackBar.open("Errore nell'eliminazione", 'OK', { duration: 3000 }),
      });
    });
  }
}
