import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Activity } from '../../core/models/activity.model';
import { MetadataService } from '../../core/services/metadata.service';

export interface MarkDoneDialogData {
  activity: Activity;
}

export interface MarkDoneDialogResult {
  doneNotes: string;
  guideName: string;
}

@Component({
  selector: 'app-mark-done-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>
      ✅ Segna come completata
    </h2>
    <mat-dialog-content>
      <p class="activity-title">{{ data.activity.title }}</p>

      @if (needsGuide) {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome {{ guideLabel() }}</mat-label>
          <input matInput [(ngModel)]="guideName" placeholder="es. Mario Rossi" />
          <mat-hint>Facoltativo</mat-hint>
        </mat-form-field>
      }

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Note post-attività</mat-label>
        <textarea
          matInput
          [(ngModel)]="doneNotes"
          rows="4"
          placeholder="Com'è andata? Condizioni, impressioni, difficoltà..."
        ></textarea>
        <mat-hint>Facoltativo</mat-hint>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Annulla</button>
      <button mat-flat-button color="primary" (click)="confirm()">
        Segna come fatta
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .activity-title {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 16px;
      color: rgba(0,0,0,0.7);
    }
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    mat-dialog-content {
      min-width: 380px;
    }
  `],
})
export class MarkDoneDialogComponent {
  data: MarkDoneDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<MarkDoneDialogComponent>);
  private meta = inject(MetadataService);

  doneNotes = '';
  guideName = '';

  readonly needsGuide = !!this.data.activity.guideType;

  guideLabel(): string {
    return this.meta.guideTypeLabel(this.data.activity.guideType);
  }

  confirm(): void {
    this.dialogRef.close({
      doneNotes: this.doneNotes,
      guideName: this.guideName,
    } satisfies MarkDoneDialogResult);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
