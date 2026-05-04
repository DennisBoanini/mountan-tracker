import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EnumOption } from '../models/metadata.model';

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  via_ferrata: 'Via Ferrata',
  via_multipitch: 'Via Multipitch',
  canale_invernale: 'Canale Invernale',
  cresta: 'Cresta',
  escursionismo: 'Escursionismo',
  alpinismo: 'Alpinismo',
  sci_alpinismo: 'Sci Alpinismo',
  arrampicata: 'Arrampicata',
  canale_estivo: 'Canale Estivo',
  altro: 'Altro',
};

const GUIDE_TYPE_LABELS: Record<string, string> = {
  alpina: 'Guida Alpina',
  ambientale: 'Guida Ambientale',
  amm: 'Guida AMM',
};

@Injectable({ providedIn: 'root' })
export class MetadataService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/metadata`;

  readonly activityTypes = signal<EnumOption[]>([]);
  readonly guideTypes = signal<EnumOption[]>([]);

  load(): Observable<void> {
    return forkJoin({
      activityTypes: this.http.get<string[]>(`${this.baseUrl}/activity-types`),
      guideTypes: this.http.get<string[]>(`${this.baseUrl}/guide-types`),
    }).pipe(
      tap(({ activityTypes, guideTypes }) => {
        this.activityTypes.set(activityTypes.map((v) => ({ value: v, label: ACTIVITY_TYPE_LABELS[v] ?? v })));
        this.guideTypes.set(guideTypes.map((v) => ({ value: v, label: GUIDE_TYPE_LABELS[v] ?? v })));
      }),
      map(() => void 0)
    );
  }

  activityTypeLabel(value: string): string {
    return this.activityTypes().find((t) => t.value === value)?.label ?? value;
  }

  guideTypeLabel(value: string | null): string {
    if (!value) return '';
    return this.guideTypes().find((g) => g.value === value)?.label ?? value;
  }
}
