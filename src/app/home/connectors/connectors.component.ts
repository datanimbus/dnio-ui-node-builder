import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef, NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { CommonService } from 'src/app/common.service';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { AlertModalComponent } from 'src/app/utils/alert-modal/alert-modal.component';
import { ExportModalComponent } from 'src/app/utils/export-modal/export-modal.component';
import { ImportModalComponent } from 'src/app/utils/import-modal/import-modal.component';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.scss']
})
export class ConnectorsComponent {

  @ViewChild('newConnector') newConnector!: TemplateRef<HTMLElement>;
  @ViewChild('newField') newField!: TemplateRef<HTMLElement>;
  connectorList: Array<any>;
  selectedConnector!: any;
  searchTerm!: string;
  newConnectorData: any;
  newFieldData: any;
  values: any;
  constructor(private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
    private commonUtils: CommonService,
    private sanitizer: DomSanitizer,
    private filterPipe: FilterPipe) {
    this.connectorList = [];
    this.values = {};
  }

  ngOnInit(): void {
    let data = localStorage.getItem('connectorList');
    if (data) {
      this.connectorList = JSON.parse(data);
    }
  }

  onEditClicked($event: MouseEvent, item: any) {
    // this.selectedConnector = _.cloneDeep(item);
    this.selectedConnector = item;
    this.values = {};
  }
  onNewClick($event: MouseEvent) {
    this.newConnectorData = { version: 1, thumbnail: '' };
    const canvasRef: NgbOffcanvasRef = this.offcanvasService.open(this.newConnector, { position: 'end' });
    canvasRef.result.then((close) => {
      if (close) {
        this.connectorList.push(this.newConnectorData);
        localStorage.setItem('connectorList', JSON.stringify(this.connectorList));
        this.selectedConnector = this.newConnectorData;
      }
    }, (dismiss) => { });
  }
  onImportClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(ImportModalComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result && result.data) {
        this.connectorList = result.data;
        localStorage.setItem('connectorList', JSON.stringify(this.connectorList));
      }
    }, (dismiss) => { });
  }
  onExportClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(ExportModalComponent, { centered: true });
    modalRef.componentInstance.filename = 'CONNECTOR_LIST_' + Date.now();
    modalRef.result.then((result) => {
      if (result && result.filename) {
        const payload = _.cloneDeep(this.connectorList);
        this.commonUtils.downloadText(result.filename + '.json', JSON.stringify(payload, null, 4));
      }
    }, (dismiss) => { });
  }
  isSelected(item: any) {
    return _.isEqual(this.selectedConnector, item);
  }
  onSaveClick($event: MouseEvent) {
    localStorage.setItem('connectorList', JSON.stringify(this.connectorList));
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
  onLabelChange($event: any) {
    this.newFieldData.key = _.camelCase($event);
  }

  changeToUpperCase($event: any, key: string) {
    this.newConnectorData[key] = _.toUpper($event);
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
  transform(html: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  get connectorListWithFilter() {
    if (this.searchTerm) {
      return this.filterPipe.transform(this.connectorList, 'label', this.searchTerm);
    }
    return this.connectorList;
  }
}
