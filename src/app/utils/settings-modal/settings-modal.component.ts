import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent {

  jsonData: any;
  isValidJSON: boolean;
  filename: string;
  version: number;
  constructor(public activeModal: NgbActiveModal,
    private commonUtils: CommonService) {
    this.isValidJSON = false;
    this.filename = 'marketplace';
    this.version = 1;
    let version = localStorage.getItem('marketplace-version');
    if (version) {
      this.version = +version;
    } else {
      this.setVersion(this.version);
    }
  }

  setVersion(version: number) {
    this.version = version;
    localStorage.setItem('marketplace-version', this.version + '');
  }

  onFileSelect(data: any) {
    if (data) {
      this.isValidJSON = true;
      this.jsonData = data;
    } else {
      this.isValidJSON = false;
      this.jsonData = null;
    }
  }

  onImportClick($event: MouseEvent) {
    this.commonUtils.setMarketplaceData(this.jsonData);
    window.location.reload();
  }

  onExportClick($event: MouseEvent) {
    this.setVersion(this.version);
    let data = this.commonUtils.getMarketplaceData();
    this.commonUtils.downloadText(`${this.filename}_v${this.version}.json`, JSON.stringify(data));
  }
}
