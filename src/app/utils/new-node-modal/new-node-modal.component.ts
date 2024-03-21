import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-new-node-modal',
  templateUrl: './new-node-modal.component.html',
  styleUrls: ['./new-node-modal.component.scss']
})
export class NewNodeModalComponent implements OnInit {

  connectorList: Array<any>;
  data: any;
  constructor(public activeModal: NgbActiveModal) {
    this.data = {};
    this.connectorList = [];
  }

  ngOnInit(): void {
    this.connectorList = JSON.parse(localStorage.getItem('connectorList') as string);
  }

  onCreateClicked($event: any) {
    if (!this.data.type.startsWith('V1_')) {
      this.data.type = 'V1_' + this.data.type;
    }
    if (_.isNull(this.data.version) || _.isUndefined(this.data.version)) {
      this.data.version = 1;
    }
    this.activeModal.close({ data: this.data });
  }

  onLabelChange($event: any) {
    this.data.type = _.toUpper(_.snakeCase($event));
  }
}
