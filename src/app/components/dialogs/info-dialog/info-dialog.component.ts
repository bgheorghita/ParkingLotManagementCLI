import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../yesno-dialog/yesno-dialog.component';

export interface Data{
  title: string,
  mainContent: string,
  secondContent: string
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data) {}


  clicked(): void{
    this.dialogRef.close();
  }
}
