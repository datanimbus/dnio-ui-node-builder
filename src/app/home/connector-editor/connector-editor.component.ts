import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { AlertModalComponent } from 'src/app/utils/alert-modal/alert-modal.component';

@Component({
  selector: 'app-connector-editor',
  templateUrl: './connector-editor.component.html',
  styleUrls: ['./connector-editor.component.scss']
})
export class ConnectorEditorComponent implements OnInit {

  @ViewChild('newField') newField!: TemplateRef<HTMLElement>;
  selectedConnector: any;
  selectedIndex!: number;
  connectorList: Array<any>;
  newFieldData: any;
  values: any;
  constructor(private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private router: Router) {
    this.connectorList = [];
    this.values = {};
  }

  ngOnInit(): void {
    let data = localStorage.getItem('connectorList');
    if (data) {
      this.connectorList = JSON.parse(data);
    }
    if (!localStorage.getItem('selectedIndex')) {
      this.router.navigate(['/home/connector']);
    }
    this.selectedIndex = parseInt(localStorage.getItem('selectedIndex') as string);
    this.selectedConnector = this.connectorList[this.selectedIndex];
    if (this.selectedConnector.initCode) {
      this.selectedConnector.initCode = this.selectedConnector.initCode.join('\n');
    }
    if (this.selectedConnector.destroyCode) {
      this.selectedConnector.destroyCode = this.selectedConnector.destroyCode.join('\n');
    }
  }

  onSaveClick($event: MouseEvent) {
    const payload = _.cloneDeep(this.selectedConnector);
    if (payload.initCode) {
      payload.initCode = payload.initCode.split('\n').filter((e: string) => e);
    }
    if (payload.destroyCode) {
      payload.destroyCode = payload.destroyCode.split('\n').filter((e: string) => e);
    }
    if (_.isNull(this.selectedIndex) || _.isUndefined(this.selectedIndex)) {
      this.connectorList.push(payload)
    } else {
      this.connectorList.splice(this.selectedIndex, 1, payload);
    }
    localStorage.setItem('connectorList', JSON.stringify(this.connectorList));
    this.onCancelClick($event);
  }
  onCancelClick($event: any) {
    localStorage.removeItem('selectedIndex');
    this.router.navigate(['/home/connector']);
  }
  onDeleteClick($event: any) {
    let modalRef: NgbModalRef = this.modalService.open(AlertModalComponent, { centered: true });
    modalRef.componentInstance.title = 'Delete Node?';
    modalRef.componentInstance.message = 'Are you sure you want to delete this connector?';
    modalRef.result.then((result) => {
      if (result) {
        this.connectorList.splice(this.selectedIndex, 1);
        localStorage.setItem('connectorList', JSON.stringify(this.connectorList));
        this.onCancelClick(null);
      }
    }, (dismiss) => { });
  }

  onNewFieldClick($event: MouseEvent) {
    this.newFieldData = { type: 'String', htmlInputType: 'text' };
    const canvasRef: NgbOffcanvasRef = this.offcanvasService.open(this.newField, { position: 'end' });
    canvasRef.result.then((close) => {
      if (close) {
        if (!this.selectedConnector.fields) {
          this.selectedConnector.fields = [];
        }
        this.selectedConnector.fields.push(this.newFieldData);
      }
    }, (dismiss) => { });
  }
  onEditFieldClick($event: MouseEvent, item: any) {
    this.newFieldData = item;
    const canvasRef: NgbOffcanvasRef = this.offcanvasService.open(this.newField, { position: 'end' });
    canvasRef.result.then((close) => {

    }, (dismiss) => { });
  }
  onDeleteFieldClick($event: MouseEvent, item: any) {
    const index = this.selectedConnector.fields.findIndex((e: any) => _.isEqual(e, item));
    const modalRef: NgbModalRef = this.modalService.open(AlertModalComponent, { centered: true });
    modalRef.componentInstance.title = 'Delete Field?';
    modalRef.componentInstance.message = 'Are you sure you want to delete field: <b>' + item.label + '</b> ?';
    modalRef.componentInstance.type = 'delete';
    modalRef.result.then((close) => {
      if (close) {
        this.selectedConnector.fields.splice(index, 1);
      }
    }, (dismiss) => { });
  }
  transform(html: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onLabelChange($event: any) {
    this.newFieldData.key = _.camelCase($event);
  }

  setValue(field: string, value: string) {
    if (!value) {
      this.values[field] = null;
    }
    else {
      this.values[field] = value;
    }
  }

  getValue(field: string) {
    return this.values[field];
  }

  parseCondition(condition: any) {
    if (!condition) {
      return true;
    }
    return Object.keys(condition).every(key => {
      if (Array.isArray(condition[key])) {
        return condition[key].includes(this.values[key]);
      }
      return this.values[key] == condition[key];
    });
  }
}
