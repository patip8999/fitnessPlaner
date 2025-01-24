import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNutrimentsComponent } from './product-nutriments.component';

describe('ProductNutrimentsComponent', () => {
  let component: ProductNutrimentsComponent;
  let fixture: ComponentFixture<ProductNutrimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductNutrimentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductNutrimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
