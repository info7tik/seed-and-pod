import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PermanentStorageService {
  constructor(private storageService: StorageService) { }

  getPermanentData(): any {
    return this.storageService.getData().permanent;
  }

  setPermanentData(key: string, value: any): void {
    const data = this.storageService.getData();
    data.permanent[key] = value;
    this.storageService.setData(data);
  }
}
