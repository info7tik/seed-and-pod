import { Injectable } from '@angular/core';
import { StorageData } from '../type/storage-data.type';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private storageService: StorageService) { }

  importData(data: string): void {
    this.storageService.setData(JSON.parse(data));
  }

  exportData(): string {
    console.log(this.storageService.getData());
    return JSON.stringify(this.storageService.getData());
  }
}
