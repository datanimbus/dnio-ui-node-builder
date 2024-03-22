import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { CommonService } from 'src/app/common.service';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ExportModalComponent } from 'src/app/utils/export-modal/export-modal.component';
import { ImportModalComponent } from 'src/app/utils/import-modal/import-modal.component';

@Component({
  selector: 'app-connectors',
  templateUrl: './connectors.component.html',
  styleUrls: ['./connectors.component.scss']
})
export class ConnectorsComponent {

  @ViewChild('newConnector') newConnector!: TemplateRef<HTMLElement>;
  connectorList: Array<any>;
  searchTerm!: string;
  newConnectorData: any;
  constructor(private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
    private commonUtils: CommonService,
    private sanitizer: DomSanitizer,
    private filterPipe: FilterPipe,
    private router: Router) {
    this.connectorList = [];
  }

  ngOnInit(): void {
    let data = localStorage.getItem('connectorList');
    if (data) {
      this.connectorList = JSON.parse(data);
    }
  }

  onEditClicked($event: MouseEvent, item: any) {
    if (!item.initCode) {
      item.initCode = ''
    }
    if (!item.destroyCode) {
      item.destroyCode = ''
    }
    let index = this.connectorList.findIndex(e => _.isEqual(e, item))
    localStorage.setItem('selectedIndex', index + '');
    this.router.navigate(['/home/connector', item.type])
  }
  onNewClick($event: MouseEvent) {
    this.newConnectorData = { version: 1, thumbnail: '' };
    const canvasRef: NgbOffcanvasRef = this.offcanvasService.open(this.newConnector, { position: 'end' });
    canvasRef.result.then((close) => {
      if (close) {
        this.connectorList.push(this.newConnectorData);
        localStorage.setItem('connectorList', JSON.stringify(this.connectorList));
        localStorage.setItem('selectedIndex', this.connectorList.length + '');
        this.router.navigate(['/home/connector', this.newConnectorData.type])
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

  changeToUpperCase($event: any, key: string) {
    this.newConnectorData[key] = _.toUpper($event);
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
