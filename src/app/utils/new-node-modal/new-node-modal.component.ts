import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-node-modal',
  templateUrl: './new-node-modal.component.html',
  styleUrls: ['./new-node-modal.component.scss']
})
export class NewNodeModalComponent {

  data: any;
  constructor(public activeModal: NgbActiveModal) {
    this.data = {};
  }
}
