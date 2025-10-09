import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly PREFIX = 'seed-and-pod-';

    /**
     * Get an item from localStorage
     * @param key - The key to retrieve
     * @param defaultValue - Default value if key doesn't exist
     * @returns The stored value or default value
     */
    getItem<T>(key: string, defaultValue: T): T {
        try {
            const fullKey = this.getFullKey(key);
            const stored = localStorage.getItem(fullKey);
            if (stored === null) {
                return defaultValue;
            }
            return JSON.parse(stored);
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return defaultValue;
        }
    }

    /**
     * Set an item in localStorage
     * @param key - The key to store
     * @param value - The value to store
     * @returns boolean - true if successful, false otherwise
     */
    setItem<T>(key: string, value: T): boolean {
        try {
            const fullKey = this.getFullKey(key);
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            return false;
        }
    }

    /**
     * Remove an item from localStorage
     * @param key - The key to remove
     * @returns boolean - true if successful, false otherwise
     */
    removeItem(key: string): boolean {
        try {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    }

    /**
     * Check if a key exists in localStorage
     * @param key - The key to check
     * @returns boolean - true if key exists, false otherwise
     */
    hasItem(key: string): boolean {
        try {
            const fullKey = this.getFullKey(key);
            return localStorage.getItem(fullKey) !== null;
        } catch (error) {
            console.error(`Error checking ${key} in localStorage:`, error);
            return false;
        }
    }

    /**
     * Get the full key with app prefix
     * @param key - The base key
     * @returns string - The full key with prefix
     */
    private getFullKey(key: string): string {
        return `${this.PREFIX}${key}`;
    }
}
