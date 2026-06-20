import { Injectable, signal, DestroyRef, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private destroyRef = inject(DestroyRef);
  private readonly STORAGE_KEY = 'trazabilidad-theme';

  isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'dark') {
      this.apply(true);
    } else if (saved === 'light') {
      this.apply(false);
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      this.apply(mq.matches);
      const listener = (e: MediaQueryListEvent) => this.apply(e.matches);
      mq.addEventListener('change', listener);
      this.destroyRef.onDestroy(() => mq.removeEventListener('change', listener));
    }
  }

  toggle() {
    const next = !this.isDark();
    this.apply(next);
    localStorage.setItem(this.STORAGE_KEY, next ? 'dark' : 'light');
  }

  private apply(dark: boolean) {
    this.isDark.set(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }
}
