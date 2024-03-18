import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaBuilderComponent } from './schema-builder.component';

describe('SchemaBuilderComponent', () => {
  let component: SchemaBuilderComponent;
  let fixture: ComponentFixture<SchemaBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemaBuilderComponent]
    });
    fixture = TestBed.createComponent(SchemaBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
