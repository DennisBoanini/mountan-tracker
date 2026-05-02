import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { ActivityService } from '../../core/services/activity.service';
import {
  Activity,
  ACTIVITY_TYPE_LABELS,
  GUIDE_TYPE_LABELS,
} from '../../core/models/activity.model';
import { ActivityFormDialogComponent } from '../../shared/components/activity-form-dialog.component';
import { MarkDoneDialogComponent } from '../../shared/components/mark-done-dialog.component';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {
  activityService = inject(ActivityService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  filterType = signal('');
  filterDone = signal('');
  filterGuide = signal('');
  expandedActivity = signal<Activity | null>(null);

  readonly displayedColumns = ['status', 'title', 'type', 'guideType', 'doneAt', 'actions'];

  activityTypes = Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  guideTypes = Object.entries(GUIDE_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  hasActiveFilters = computed(
    () => !!(this.filterType() || this.filterDone() || this.filterGuide())
  );

  ngOnInit(): void {
    this.activityService.loadAll();
  }

  applyFilters(): void {
    this.activityService.loadAll({
      type: this.filterType() || undefined,
      done: this.filterDone() || undefined,
      guideType: this.filterGuide() || undefined,
    });
  }

  clearFilters(): void {
    this.filterType.set('');
    this.filterDone.set('');
    this.filterGuide.set('');
    this.activityService.loadAll();
  }

  toggleExpanded(activity: Activity): void {
    this.expandedActivity.set(
      this.expandedActivity() === activity ? null : activity
    );
  }

  typeLabel(type: string): string {
    return ACTIVITY_TYPE_LABELS[type as keyof typeof ACTIVITY_TYPE_LABELS] ?? type;
  }

  guideLabel(gt: string | null): string {
    if (!gt) return '';
    return GUIDE_TYPE_LABELS[gt as keyof typeof GUIDE_TYPE_LABELS] ?? gt;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  goToDetail(id: string, event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.closest('button')) return;
    }
    this.router.navigate(['/activities', id]);
  }

  openLink(url: string, event: Event): void {
    event.stopPropagation();
    window.open(url, '_blank');
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(ActivityFormDialogComponent, {
      data: {},
      width: '500px',
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.activityService.create(result).subscribe({
        next: () => this.snackBar.open('Attività creata!', 'OK', { duration: 3000 }),
        error: () => this.snackBar.open('Errore nella creazione', 'OK', { duration: 3000 }),
      });
    });
  }

  openMarkDoneDialog(activity: Activity): void {
    const ref = this.dialog.open(MarkDoneDialogComponent, {
      data: { activity },
      width: '460px',
    });
    ref.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      this.activityService.markDone(activity.id, result).subscribe({
        next: () => this.snackBar.open('Ottimo! Attività completata 🎉', 'OK', { duration: 3000 }),
        error: () => this.snackBar.open('Errore', 'OK', { duration: 3000 }),
      });
    });
  }

  undoMarkDone(activity: Activity): void {
    this.activityService.markUndone(activity.id).subscribe({
      next: () => this.snackBar.open('Completamento annullato', 'OK', { duration: 3000 }),
      error: () => this.snackBar.open('Errore', 'OK', { duration: 3000 }),
    });
  }
}
