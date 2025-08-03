import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public toastr: ToastrService) {}

  showNotification(type: string, title: string, message: string) {
    if (type === 'success') {
      this.toastr.success(message, title, {
        progressBar: true,
        closeButton: true,
        timeOut: 2000,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-center'
      });
    }
    if (type === 'danger') {
      this.toastr.error(message, title, {
        progressBar: true,
        closeButton: true,
        timeOut: 3000,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-center'
      });
    }
    if (type === 'warning') {
      this.toastr.warning(message, title, {
        progressBar: true,
        closeButton: true,
        timeOut: 2500,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-center'
      });
    }
    if (type === 'info') {
      this.toastr.info(message, title, {
        progressBar: true,
        closeButton: true,
        timeOut: 2300,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-center'
      });
    }
  }
}
