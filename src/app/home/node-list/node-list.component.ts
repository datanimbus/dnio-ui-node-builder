import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { ApiService } from 'src/app/api.service';

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
  constructor(private apiService: ApiService) {
    this.nodeList = [];
    this.groupList = [];
  }

  ngOnInit(): void {
    this.apiService.get('/assets/node-list.json').subscribe({
      next: (value: any) => {
        this.nodeList = value;
        let groups = this.nodeList.map(e=>e.group);
        this.groupList = _.uniq(groups);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
