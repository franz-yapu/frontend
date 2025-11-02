import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesAllComponent } from './courses-all.component';

describe('CoursesAllComponent', () => {
  let component: CoursesAllComponent;
  let fixture: ComponentFixture<CoursesAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
