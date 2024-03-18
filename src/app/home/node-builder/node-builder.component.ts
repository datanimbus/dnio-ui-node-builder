import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { CommonService } from 'src/app/common.service';
import { ImportModalComponent } from 'src/app/utils/import-modal/import-modal.component';
import { NewNodeModalComponent } from 'src/app/utils/new-node-modal/new-node-modal.component';
import { ExportModalComponent } from 'src/app/utils/export-modal/export-modal.component';


@Component({
  selector: 'app-node-builder',
  templateUrl: './node-builder.component.html',
  styleUrls: ['./node-builder.component.scss']
})
export class NodeBuilderComponent implements OnInit {

  data: any;
  editorOptions = { theme: 'vs-light', language: 'javascript' };
  toggleFullScreen: boolean;
  constructor(private modalService: NgbModal,
    private commonUtils: CommonService) {
    // this.data = {};
    this.toggleFullScreen = false;
  }
  ngOnInit(): void {

  }
  resetNode(data?: any) {
    if (Array.isArray(data.code)) {
      data.code = data.code.join('\n');
    }
    let iniNode = this.commonUtils.initNodeData();
    if (data) {
      this.data = _.merge(iniNode, data);
    } else {
      this.data = iniNode;
    }
  }
  onSchemaChange($event: any, type: string) {
    console.log($event, type);
  }
  onModelChange($event: any) {
    console.log($event);
  }

  onNewClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(NewNodeModalComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result && result.data) {
        this.resetNode(result.data);
      }
    }, (dismiss) => { });
  }
  onImportClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(ImportModalComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result && result.data) {
        this.resetNode(result.data);
      }
    }, (dismiss) => { });
  }
  onExportClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(ExportModalComponent, { centered: true });
    modalRef.componentInstance.filename = 'V1_' + (this.data.label || this.data.type);
    modalRef.result.then((result) => {
      if (result && result.filename) {
        const payload = _.cloneDeep(this.data);
        payload.code = payload.code.split('\n');
        this.commonUtils.downloadText(result.filename + '.json', JSON.stringify(payload, null, 4));
      }
    }, (dismiss) => { });
  }
}
