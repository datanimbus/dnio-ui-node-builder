import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private apiService: ApiService,
    private router: Router) {
    this.nodeList = [];
    this.groupList = [];
  }

  ngOnInit(): void {
    let data = localStorage.getItem('nodeList');
    if (data) {
      this.nodeList = JSON.parse(data);
      this.groupList = _.uniq(this.nodeList.map(e => e.group));
    }
    if (this.nodeList && this.nodeList.length == 0) {
      this.apiService.get('/assets/node-list.json').subscribe({
        next: (value: any) => {
          this.nodeList = value;
          localStorage.setItem('nodeList', JSON.stringify(this.nodeList));
          this.groupList = _.uniq(this.nodeList.map(e => e.group));
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
  onEditClicked($event: MouseEvent, item: any) {
    let index = this.nodeList.findIndex(e => _.isEqual(e, item))
    localStorage.setItem('selectedIndex', index + '');
    this.router.navigate(['/home/node', item.type])
  }
}
