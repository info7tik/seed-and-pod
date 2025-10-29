import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SettingsService } from '../service/settings.service';
import { HeaderMenu } from '../header-menu/header-menu.component';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, TranslocoModule, HeaderMenu],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  importError: string | null = null;
  importSuccess: boolean = false;
  deleteSuccess: boolean = false;

  constructor(private settingsService: SettingsService, private transloco: TranslocoService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          this.settingsService.importData(content);
          this.importError = null;
          this.importSuccess = true;
          setTimeout(() => this.importSuccess = false, 3000);
        } catch (error) {
          this.importError = this.transloco.translate('menu.settings.messages.invalidJson');
          this.importSuccess = false;
        }
      };
      reader.readAsText(file);
    } else {
      this.importError = this.transloco.translate('menu.settings.messages.invalidFile');
      this.importSuccess = false;
    }
  }

  exportData(): void {
    try {
      const data = this.settingsService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `seed-and-pod-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.importError = this.transloco.translate('menu.settings.messages.exportError');
    }
  }

  deleteData(): void {
    localStorage.clear();
    this.deleteSuccess = true;
    setTimeout(() => this.deleteSuccess = false, 3000);
  }
}
