import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-schema-builder',
  templateUrl: './schema-builder.component.html',
  styleUrls: ['./schema-builder.component.scss']
})
export class SchemaBuilderComponent implements OnInit {
  @Input() schema: Array<any>;
  @Output() schemaChange: EventEmitter<Array<any>>;
  constructor() {
    this.schema = [];
    this.schemaChange = new EventEmitter();
  }

  ngOnInit(): void {
    if (!this.schema) {
      this.schema = [];
    }
    if (this.schema.length == 0) {
      this.schema.push({});
    }
  }

  onKeyChange($event: any, item: any) {
    item.key = _.camelCase($event);
    this.schemaChange.emit(this.schema);
  }

  onTypeChange($event: any, item: any) {
    if ($event == 'Object') {
      item.schema = [];
    } else if ($event == 'Array') {
      item.subType = 'String';
    } else {
      delete item.schema;
      delete item.subType;
    }
    item.type = $event;
    this.schemaChange.emit(this.schema);
  }

  onSubTypeChange($event: any, item: any) {
    if ($event == 'Object') {
      item.schema = [];
    } else {
      delete item.schema;
    }
    item.subType = $event;
    this.schemaChange.emit(this.schema);
  }

  onJSONPaste($event: any, item: any) {
    console.log($event);
    this.schema = $event;
    this.schemaChange.emit($event);
  }
  addField(i: number) {
    this.schema.splice(i + 1, 0, {});
  }
  removeField(i: number) {
    this.schema.splice(i, 1);
  }
}
