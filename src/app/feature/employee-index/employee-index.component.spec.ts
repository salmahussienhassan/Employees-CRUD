import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIndexComponent } from './employee-index.component';

describe('EmployeeIndexComponent', () => {
  let component: EmployeeIndexComponent;
  let fixture: ComponentFixture<EmployeeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
