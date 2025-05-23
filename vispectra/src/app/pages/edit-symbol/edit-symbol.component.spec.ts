import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSymbolComponent } from './edit-symbol.component';

describe('EditSymbolComponent', () => {
  let component: EditSymbolComponent;
  let fixture: ComponentFixture<EditSymbolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSymbolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
