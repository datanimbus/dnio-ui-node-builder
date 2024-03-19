import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  nodeList: Array<any>;
  selectedIndex: any;
  constructor(private modalService: NgbModal,
    private commonUtils: CommonService,
    private router: Router) {
    this.toggleFullScreen = false;
    this.nodeList = [];
    this.selectedIndex = null;
  }
  ngOnInit(): void {
    let data = localStorage.getItem('nodeList');
    if (data) {
      this.nodeList = JSON.parse(data);
      this.selectedIndex = parseInt(localStorage.getItem('selectedIndex') as string);
      if (this.nodeList[this.selectedIndex].code) {
        this.nodeList[this.selectedIndex].code = this.nodeList[this.selectedIndex].code.join('\n');
      }
      this.data = this.nodeList[this.selectedIndex];
    }
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
  onCancelClick($event: any) {
    localStorage.removeItem('selectedIndex');
    this.router.navigate(['../']);
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
  onSaveClick($event: MouseEvent) {
    const payload = _.cloneDeep(this.data);
    payload.code = payload.code.split('\n').filter((e: string) => e);
    if (_.isNull(this.selectedIndex)) {
      this.nodeList.push(payload)
    } else {
      this.nodeList.splice(this.selectedIndex, 1, payload);
    }
    localStorage.setItem('nodeList', JSON.stringify(this.nodeList));
    this.onCancelClick(null);
  }
}
