import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBehaviorComponent } from './home-behavior.component';

describe('HomeBehaviorComponent', () => {
  let component: HomeBehaviorComponent;
  let fixture: ComponentFixture<HomeBehaviorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBehaviorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBehaviorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
