import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../../components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler{

  constructor(private dialog: MatDialog, private ngZone: NgZone) {
    super();
  }

  public override handleError(err: Error | HttpErrorResponse): void {
    console.log("globalHandleError")
    let errorMessage = 'An error has occured';
    console.log(err);

    if(err instanceof Error){
      errorMessage = err.message;
    }
    
    if(err instanceof HttpErrorResponse){
      errorMessage = err.error;

      if(err.status === 0){
        errorMessage = 'The server does not respond...';
      }
      if(err.status === 403){
        errorMessage = 'Access forbidden.';
      }
    }

    this.ngZone.run(() => {
      this.dialog.open(AlertComponent, {
        data: { icon: 'Error', message: errorMessage, buttonText: 'Ok' },
      });
    });
  }
}
