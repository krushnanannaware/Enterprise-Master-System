import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'hcl_erp_';
  private memoryCache = new Map<string, any>();

  getItem<T>(key: string, defaultValue: T): T {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) as T;
    }

    try {
      const data = localStorage.getItem(this.PREFIX + key);
      if (data === null || data === undefined) {
        this.memoryCache.set(key, defaultValue);
        return defaultValue;
      }
      const parsed = JSON.parse(data) as T;
      this.memoryCache.set(key, parsed);
      return parsed;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      this.memoryCache.set(key, defaultValue);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    this.memoryCache.set(key, value);
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  }

  removeItem(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  }

  clearAll(): void {
    this.memoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error('Error clearing ERP localStorage:', e);
    }
  }

  hasKey(key: string): boolean {
    return this.memoryCache.has(key) || localStorage.getItem(this.PREFIX + key) !== null;
  }
}
