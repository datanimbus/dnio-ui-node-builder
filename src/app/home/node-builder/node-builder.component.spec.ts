import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeBuilderComponent } from './node-builder.component';

describe('NodeBuilderComponent', () => {
  let component: NodeBuilderComponent;
  let fixture: ComponentFixture<NodeBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeBuilderComponent]
    });
    fixture = TestBed.createComponent(NodeBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
