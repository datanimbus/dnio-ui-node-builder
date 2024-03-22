import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorEditorComponent } from './connector-editor.component';

describe('ConnectorEditorComponent', () => {
  let component: ConnectorEditorComponent;
  let fixture: ComponentFixture<ConnectorEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectorEditorComponent]
    });
    fixture = TestBed.createComponent(ConnectorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
