import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SettingsModalComponent } from '../utils/settings-modal/settings-modal.component';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private modalService: NgbModal,
    private commonUtils: CommonService) {
    this.commonUtils.setMarketplaceData();
  }

  onSettingsClick($event: MouseEvent) {
    let tempModal: NgbModalRef = this.modalService.open(SettingsModalComponent, { centered: true });
    tempModal.result.then((close) => { }, (dismiss) => { })
  }
}
