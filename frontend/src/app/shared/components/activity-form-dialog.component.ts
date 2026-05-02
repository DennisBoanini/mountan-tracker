import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Activity,
  ActivityType,
  GuideType,
  ACTIVITY_TYPE_LABELS,
  GUIDE_TYPE_LABELS,
} from '../../core/models/activity.model';

export interface ActivityFormDialogData {
  activity?: Activity; // se presente è edit, altrimenti create
}

@Component({
  selector: 'app-activity-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEdit ? 'Modifica attività' : 'Nuova attività' }}
    </h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titolo *</mat-label>
          <input matInput formControlName="title" placeholder="es. Ferrata della Roda" />
          @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
            <mat-error>Il titolo è obbligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo attività *</mat-label>
          <mat-select formControlName="type">
            @for (entry of activityTypes; track entry.value) {
              <mat-option [value]="entry.value">{{ entry.label }}</mat-option>
            }
          </mat-select>
          @if (form.get('type')?.hasError('required') && form.get('type')?.touched) {
            <mat-error>Il tipo è obbligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo guida</mat-label>
          <mat-select formControlName="guideType">
            <mat-option [value]="null">Nessuna guida</mat-option>
            @for (entry of guideTypes; track entry.value) {
              <mat-option [value]="entry.value">{{ entry.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Link</mat-label>
          <input matInput formControlName="link" placeholder="https://..." type="url" />
          <mat-hint>Link a relazione, scheda gita, ecc.</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Note</mat-label>
          <textarea
            matInput
            formControlName="notes"
            rows="4"
            placeholder="Info utili, difficoltà, materiale necessario..."
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Annulla</button>
      <button
        mat-flat-button
        color="primary"
        (click)="confirm()"
        [disabled]="form.invalid"
      >
        {{ isEdit ? 'Salva modifiche' : 'Crea attività' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }
    mat-dialog-content {
      min-width: 420px;
    }
    .form-grid {
      display: flex;
      flex-direction: column;
      padding-top: 8px;
    }
  `],
})
export class ActivityFormDialogComponent implements OnInit {
  data: ActivityFormDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ActivityFormDialogComponent>);
  private fb = inject(FormBuilder);

  isEdit = !!this.data.activity;

  activityTypes = Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => ({
    value: value as ActivityType,
    label,
  }));

  guideTypes = Object.entries(GUIDE_TYPE_LABELS).map(([value, label]) => ({
    value: value as GuideType,
    label,
  }));

  form = this.fb.group({
    title: ['', Validators.required],
    type: ['' as ActivityType, Validators.required],
    guideType: [null as GuideType],
    link: [''],
    notes: [''],
  });

  ngOnInit(): void {
    if (this.data.activity) {
      const a = this.data.activity;
      this.form.patchValue({
        title: a.title,
        type: a.type,
        guideType: a.guideType,
        link: a.link,
        notes: a.notes,
      });
    }
  }

  confirm(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
