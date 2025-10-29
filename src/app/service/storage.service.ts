import { Injectable } from '@angular/core';
import { StorageData } from '../type/storage-data.type';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly DATA_KEY = 'seed-and-pod-data';
    protected readonly DEFAULT_DATA: StorageData = { years: {}, permanent: {}, selectedYear: 0 };

    getData(): StorageData {
        return JSON.parse(localStorage.getItem(this.DATA_KEY) || JSON.stringify(this.DEFAULT_DATA));
    }

    setData(data: StorageData): void {
        localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
    }

    clear(): void {
        localStorage.clear();
    }
}
