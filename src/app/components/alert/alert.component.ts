import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Data{
  message: string,
  icon: string,
  buttonText: string
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  message: string = 'An error has occurred';
  icon: string = '';
  buttonText = 'Ok';

  constructor(@Inject(MAT_DIALOG_DATA) private data: Data, private dialogRef: MatDialogRef<AlertComponent>) {
    if (data.icon) {this.icon = data.icon;}
    if (data.message) {this.message = data.message;}
    if (data.buttonText) {this.buttonText = data.buttonText;}
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
