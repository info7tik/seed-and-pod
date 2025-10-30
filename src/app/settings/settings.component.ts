import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SettingsService } from '../service/settings.service';
import { HeaderMenu } from '../header-menu/header-menu.component';
import { Directory, Encoding, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { MessageComponent } from "../message/message.component";

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, TranslocoModule, HeaderMenu, MessageComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  importError: string | null = null;
  importSuccess: boolean = false;
  deleteSuccess: boolean = false;

  @ViewChild('deleteMessage') deleteMessage!: MessageComponent;
  @ViewChild('exportMessage') exportMessage!: MessageComponent;
  @ViewChild('importMessage') importMessage!: MessageComponent;

  constructor(private settingsService: SettingsService, private transloco: TranslocoService) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          this.settingsService.importData(content);
          this.importMessage.showSuccess('menu.settings.messages.importSuccess');
        } catch (error) {
          this.importMessage.showError('menu.settings.messages.invalidJson');
        }
      };
      reader.readAsText(file);
    } else {
      this.importMessage.showError('menu.settings.messages.invalidFile');
    }
  }

  exportData(): void {
    this.saveOnDeviceStorage().then(() => {
      this.exportMessage.showSuccess('menu.settings.messages.exportSuccess');
    }).catch(() => {
      this.exportMessage.showError('menu.settings.messages.exportError');
    });
  }

  saveOnDeviceStorage(): Promise<WriteFileResult> {
    const jsonData = this.settingsService.exportData();
    if (jsonData) {
      return Filesystem.writeFile({
        path: `seed-and-pod-backup-${new Date().toISOString().split('T')[0]}.json`,
        data: jsonData,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
    } else {
      return new Promise<WriteFileResult>((resolve, reject) => {
        this.exportMessage.showError('menu.settings.messages.exportError');
        reject("no data to export");
      });
    }
  }

  deleteData(): void {
    localStorage.clear();
    this.deleteMessage.showSuccess('menu.settings.messages.deleteSuccess');
  }
}
