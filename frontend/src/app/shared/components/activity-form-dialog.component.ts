import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Activity, ActivityType, GuideType } from '../../core/models/activity.model';
import { MetadataService } from '../../core/services/metadata.service';

export interface ActivityFormDialogData {
  activity?: Activity;
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
    MatIconModule,
    MatTooltipModule,
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
            @for (entry of meta.activityTypes(); track entry.value) {
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
            @for (entry of meta.guideTypes(); track entry.value) {
              <mat-option [value]="entry.value">{{ entry.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <!-- Links section -->
        <div class="links-section" formArrayName="links">
          <div class="links-header">
            <span class="links-label">Link</span>
            <button mat-icon-button type="button" (click)="addLink()" matTooltip="Aggiungi link">
              <mat-icon>add_circle_outline</mat-icon>
            </button>
          </div>
          @for (ctrl of linksArray.controls; track $index) {
            <div [formGroupName]="$index" class="link-row">
              <mat-form-field appearance="outline" class="link-name-field">
                <mat-label>Nome *</mat-label>
                <input matInput formControlName="name" placeholder="es. Relazione Gita" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="link-url-field">
                <mat-label>URL</mat-label>
                <input matInput formControlName="url" placeholder="https://..." type="url" />
              </mat-form-field>
              <button mat-icon-button type="button" color="warn"
                (click)="removeLink($index)"
                matTooltip="Rimuovi link">
                <mat-icon>remove_circle_outline</mat-icon>
              </button>
            </div>
          }
          @if (linksArray.length === 0) {
            <p class="no-links-hint">Nessun link. Clicca + per aggiungerne uno.</p>
          }
        </div>

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
      min-width: 480px;
    }
    .form-grid {
      display: flex;
      flex-direction: column;
      padding-top: 8px;
    }
    .links-section {
      margin-bottom: 12px;
    }
    .links-header {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
    }
    .links-label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      flex: 1;
    }
    .link-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 4px;
    }
    .link-name-field {
      flex: 0 0 160px;
    }
    .link-url-field {
      flex: 1;
    }
    .no-links-hint {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.4);
      margin: 0 0 8px 0;
    }
  `],
})
export class ActivityFormDialogComponent implements OnInit {
  data: ActivityFormDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ActivityFormDialogComponent>);
  private fb = inject(FormBuilder);
  protected meta = inject(MetadataService);

  isEdit = !!this.data.activity;

  form = this.fb.group({
    title: ['', Validators.required],
    type: ['' as ActivityType, Validators.required],
    guideType: [null as GuideType],
    links: this.fb.array([]),
    notes: [''],
  });

  get linksArray(): FormArray {
    return this.form.get('links') as FormArray;
  }

  ngOnInit(): void {
    if (this.data.activity) {
      const a = this.data.activity;
      this.form.patchValue({
        title: a.title,
        type: a.type,
        guideType: a.guideType,
        notes: a.notes,
      });
      (a.links || []).forEach(l => {
        this.linksArray.push(this.fb.group({ name: [l.name, Validators.required], url: [l.url] }));
      });
    }
  }

  addLink(): void {
    this.linksArray.push(this.fb.group({ name: ['', Validators.required], url: [''] }));
  }

  removeLink(i: number): void {
    this.linksArray.removeAt(i);
  }

  confirm(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
