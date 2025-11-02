import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesModalComponent } from './courses-modal.component';

describe('CoursesModalComponent', () => {
  let component: CoursesModalComponent;
  let fixture: ComponentFixture<CoursesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
