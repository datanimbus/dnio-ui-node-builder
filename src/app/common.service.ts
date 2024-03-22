import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  updateCodeEditorState: EventEmitter<any>;

  constructor() {
    this.updateCodeEditorState = new EventEmitter();
  }

  initNodeData() {
    return {
      category: 'PROCESS',
      group: 'Misc',
      type: 'V1_',
      label: '',
      icon: '',
      version: 1,
      inputSchema: [{}],
      outputSchema: [{}],
      errorSchema: [
        {
          key: 'code',
          type: 'Number'
        },
        {
          key: 'message',
          type: 'String'
        },
        {
          key: 'stackTrace',
          type: 'String'
        }
      ],
      connectorType: 'NONE'
    };
  }

  convertJSONtoSchema(json: any) {
    const schema: any = [];
    if (json) {
      Object.keys(json).forEach((key) => {
        let item: any = {};
        item.key = key;
        item.type = _.capitalize(typeof json[key]);
        if (item.type == 'Object') {
          if (Array.isArray(json[key])) {
            item.type = 'Array';
            if (json[key][0]) {
              item.subType = _.capitalize(typeof json[key][0]);
              if (item.subType == 'Object') {
                item.schema = this.convertJSONtoSchema(json[key][0]);
              }
            }
          } else {
            item.schema = this.convertJSONtoSchema(json[key]);
          }
        }
        schema.push(item);
      });
    }
    return schema;
  }

  readFileData(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        resolve(event.target.result);
      });
      reader.addEventListener('error', (err: any) => {
        reject(err);
      });
      reader.readAsText(file);
    })
  }

  downloadText(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
