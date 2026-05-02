import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Activity,
  CreateActivityDto,
  UpdateActivityDto,
  MarkDoneDto,
} from '../models/activity.model';
import { Observable, tap } from 'rxjs';

export interface ActivityFilters {
  type?: string;
  done?: string;
  guideType?: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/activities`;

  // State signals
  private _activities = signal<Activity[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly activities = this._activities.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Derived signals
  readonly doneCount = computed(() => this._activities().filter((a) => a.done).length);
  readonly todoCount = computed(() => this._activities().filter((a) => !a.done).length);

  loadAll(filters: ActivityFilters = {}): void {
    this._loading.set(true);
    this._error.set(null);

    let params = new HttpParams();
    if (filters.type) params = params.set('type', filters.type);
    if (filters.done !== undefined && filters.done !== '') params = params.set('done', filters.done);
    if (filters.guideType) params = params.set('guideType', filters.guideType);

    this.http.get<Activity[]>(this.baseUrl, { params }).subscribe({
      next: (activities) => {
        this._activities.set(activities);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Errore nel caricamento delle attività');
        this._loading.set(false);
        console.error(err);
      },
    });
  }

  getById(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateActivityDto): Observable<Activity> {
    return this.http.post<Activity>(this.baseUrl, dto).pipe(
      tap((created) => {
        this._activities.update((list) => [created, ...list]);
      })
    );
  }

  update(id: string, dto: UpdateActivityDto): Observable<Activity> {
    return this.http.put<Activity>(`${this.baseUrl}/${id}`, dto).pipe(
      tap((updated) => {
        this._activities.update((list) => list.map((a) => (a.id === id ? updated : a)));
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._activities.update((list) => list.filter((a) => a.id !== id));
      })
    );
  }

  markDone(id: string, dto: MarkDoneDto): Observable<Activity> {
    return this.http.patch<Activity>(`${this.baseUrl}/${id}/done`, dto).pipe(
      tap((updated) => {
        this._activities.update((list) => list.map((a) => (a.id === id ? updated : a)));
      })
    );
  }

  markUndone(id: string): Observable<Activity> {
    return this.http.delete<Activity>(`${this.baseUrl}/${id}/done`).pipe(
      tap((updated) => {
        this._activities.update((list) => list.map((a) => (a.id === id ? updated : a)));
      })
    );
  }
}
