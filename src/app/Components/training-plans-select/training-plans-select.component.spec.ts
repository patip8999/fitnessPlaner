import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPlansSelectComponent } from './training-plans-select.component';

describe('TrainingPlansSelectComponent', () => {
  let component: TrainingPlansSelectComponent;
  let fixture: ComponentFixture<TrainingPlansSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPlansSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingPlansSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
