import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNodeModalComponent } from './new-node-modal.component';

describe('NewNodeModalComponent', () => {
  let component: NewNodeModalComponent;
  let fixture: ComponentFixture<NewNodeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewNodeModalComponent]
    });
    fixture = TestBed.createComponent(NewNodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
