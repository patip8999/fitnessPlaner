import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPlanDetailComponent } from './training-plan-detail.component';

describe('TrainingPlanDetailComponent', () => {
  let component: TrainingPlanDetailComponent;
  let fixture: ComponentFixture<TrainingPlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPlanDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
