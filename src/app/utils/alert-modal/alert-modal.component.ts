import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {

  title!: string;
  message!: string;
  type:string;
  constructor(public activeModal: NgbActiveModal) {
    this.type = 'alert';
  }
}
