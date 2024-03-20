import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/common.service';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ExportModalComponent } from 'src/app/utils/export-modal/export-modal.component';
import { ImportModalComponent } from 'src/app/utils/import-modal/import-modal.component';
import { NewNodeModalComponent } from 'src/app/utils/new-node-modal/new-node-modal.component';

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent implements OnInit {

  nodeList: Array<any>;
  groupList: Array<string>;
  selectedGroup!: any;
  selectedNode!: string;
  searchTerm!: string;
  constructor(private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private commonUtils: CommonService,
    private filterPipe: FilterPipe) {
    this.nodeList = [];
    this.groupList = [];
  }

  ngOnInit(): void {
    let data = localStorage.getItem('nodeList');
    if (data) {
      this.nodeList = JSON.parse(data);
      this.groupList = _.uniq(this.nodeList.map(e => e.group));
    }
    // if (this.nodeList && this.nodeList.length == 0) {
    //   this.apiService.get('/assets/node-list.json').subscribe({
    //     next: (value: any) => {
    //       this.nodeList = value;
    //       localStorage.setItem('nodeList', JSON.stringify(this.nodeList));
    //       this.groupList = _.uniq(this.nodeList.map(e => e.group));
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     }
    //   });
    // }
  }

  resetNode(data?: any) {
    if (Array.isArray(data.code)) {
      data.code = data.code.join('\n');
    }
    let iniNode = this.commonUtils.initNodeData();
    if (data) {
      return _.merge(iniNode, data);
    } else {
      return iniNode;
    }
  }

  onEditClicked($event: MouseEvent, item: any) {
    let index = this.nodeList.findIndex(e => _.isEqual(e, item))
    localStorage.setItem('selectedIndex', index + '');
    this.router.navigate(['/home/node', item.type])
  }
  onNewClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(NewNodeModalComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result && result.data) {
        let tempNode = this.resetNode(result.data);
        localStorage.setItem('selectedIndex', this.nodeList.length + '');
        this.nodeList.push(tempNode);
        localStorage.setItem('nodeList', JSON.stringify(this.nodeList));
        this.router.navigate(['/home/node', tempNode.type])
      }
    }, (dismiss) => { });
  }
  onImportClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(ImportModalComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result && result.data) {
        this.nodeList = result.data;
        this.groupList = _.uniq(this.nodeList.map(e => e.group));
        localStorage.setItem('nodeList', JSON.stringify(this.nodeList));
      }
    }, (dismiss) => { });
  }
  onExportClick($event: MouseEvent) {
    let modalRef: NgbModalRef = this.modalService.open(ExportModalComponent, { centered: true });
    modalRef.componentInstance.filename = 'NODE_LIST_' + Date.now();
    modalRef.result.then((result) => {
      if (result && result.filename) {
        const payload = _.cloneDeep(this.nodeList);
        this.commonUtils.downloadText(result.filename + '.json', JSON.stringify(payload, null, 4));
      }
    }, (dismiss) => { });
  }

  get nodeListByFilter() {
    if (this.selectedGroup) {
      return this.filterPipe.transform(this.nodeList, 'group', this.selectedGroup);
    } else if (this.searchTerm) {
      return this.filterPipe.transform(this.nodeList, 'label', this.searchTerm);
    } else {
      return this.nodeList;
    }
  }
}
