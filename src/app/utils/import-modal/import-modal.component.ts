import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-import-modal',
  templateUrl: './import-modal.component.html',
  styleUrls: ['./import-modal.component.scss']
})
export class ImportModalComponent {

  jsonData: any;
  isValidJSON: boolean;
  constructor(public activeModal: NgbActiveModal) {
    this.isValidJSON = false;
  }

  onFileSelect(data: any) {
    if (data) {
      this.isValidJSON = true;
      this.jsonData = data;
    }
  }

  onJSONPaste($event: any) {
    let text = $event.target.value;
    try {
      this.jsonData = JSON.parse(text);
      this.isValidJSON = true;
    } catch (err) {
      this.isValidJSON = false;
    }
  }

}
