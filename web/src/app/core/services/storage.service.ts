import { Injectable } from '@angular/core';

function isBrowser(): boolean {
  try { return typeof window !== 'undefined' && !!window.localStorage; }
  catch { return false; }
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private get ls(): Storage | null {
    return isBrowser() ? window.localStorage : null;
  }

  get(key: string): string | null {
    try { return this.ls?.getItem(key) ?? null; } catch { return null; }
  }
  set(key: string, val: string): void {
    try { this.ls?.setItem(key, val); } catch {}
  }
  remove(key: string): void {
    try { this.ls?.removeItem(key); } catch {}
  }
}
