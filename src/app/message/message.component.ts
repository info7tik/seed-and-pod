import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-message',
  imports: [TranslocoPipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  readonly NO_MESSAGE: string = 'no_message';
  errorMessageKey: string = this.NO_MESSAGE;
  successMessageKey: string = this.NO_MESSAGE;

  showError(messageKey: string) {
    this.successMessageKey = this.NO_MESSAGE;
    this.errorMessageKey = messageKey;
    setTimeout(() => this.errorMessageKey = this.NO_MESSAGE, 3000);
  };

  showSuccess(messageKey: string) {
    this.errorMessageKey = this.NO_MESSAGE;
    this.successMessageKey = messageKey;
    setTimeout(() => this.successMessageKey = this.NO_MESSAGE, 3000);
  };
}
