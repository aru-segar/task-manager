import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private snack: MatSnackBar) { }

    show(message: string) {
        this.snack.open(message, 'OK', {
            duration: 3500,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        })
    }
}