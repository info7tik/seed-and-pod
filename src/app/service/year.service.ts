import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  public readonly YEAR_KEY = 'year';

  constructor(private storageService: StorageService) { }
}
