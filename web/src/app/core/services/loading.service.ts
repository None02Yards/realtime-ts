import { Injectable, computed, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type LoadMode = 'dots' | 'type' | 'wave';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = signal(0);
  text = signal('Loading');
  mode = signal<LoadMode>('dots');

  isVisible = computed(() => this.count() > 0);

  start(text?: string, mode?: LoadMode) {
    if (text) this.text.set(text);
    if (mode) this.mode.set(mode);
    this.count.update(n => n + 1);
  }
  stop() {
    this.count.update(n => Math.max(0, n - 1));
  }

  // Helper to wrap observables
  track<T>(obs: Observable<T>, text?: string, mode?: LoadMode) {
    this.start(text, mode);
    return obs.pipe(finalize(() => this.stop()));
  }
}
