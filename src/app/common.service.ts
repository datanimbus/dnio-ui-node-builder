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

  setMarketplaceData(data?: MarketplaceData) {
    if (!data) {
      data = this.getMarketplaceData();
    }
    if (!data.version) {
      data.version = 1;
    }
    if (!data.nodeList) {
      data.nodeList = [];
    }
    if (!data.connectorList) {
      data.connectorList = [];
    }
    if (!data.dataFormatList) {
      data.dataFormatList = [];
    }
    if (!data.dataPipeList) {
      data.dataPipeList = [];
    }
    localStorage.setItem('marketplace-version', data.version + '')
    localStorage.setItem('nodeList', JSON.stringify(data.nodeList))
    localStorage.setItem('connectorList', JSON.stringify(data.connectorList))
    localStorage.setItem('dataFormatList', JSON.stringify(data.dataFormatList))
    localStorage.setItem('dataPipeList', JSON.stringify(data.dataPipeList))
  }

  getMarketplaceData(): MarketplaceData {
    const data: MarketplaceData = {} as MarketplaceData;
    if (localStorage.getItem('marketplace-version')) {
      data.version = parseInt(localStorage.getItem('marketplace-version') as string);
    } else {
      data.version = 1;
    }
    if (localStorage.getItem('nodeList')) {
      data.nodeList = JSON.parse(localStorage.getItem('nodeList') as string);
    } else {
      data.nodeList = [];
    }
    if (localStorage.getItem('connectorList')) {
      data.connectorList = JSON.parse(localStorage.getItem('connectorList') as string);
    } else {
      data.connectorList = [];
    }
    if (localStorage.getItem('dataFormatList')) {
      data.dataFormatList = JSON.parse(localStorage.getItem('dataFormatList') as string);
    } else {
      data.dataFormatList = [];
    }
    if (localStorage.getItem('dataPipeList')) {
      data.dataPipeList = JSON.parse(localStorage.getItem('dataPipeList') as string);
    } else {
      data.dataPipeList = [];
    }
    return data;
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


export interface MarketplaceData {
  version: number;
  nodeList: Array<any>;
  connectorList: Array<any>;
  dataFormatList: Array<any>;
  dataPipeList: Array<any>;
}