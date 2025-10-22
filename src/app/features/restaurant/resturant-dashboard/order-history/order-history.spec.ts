import { ComponentFixture, TestBed } from '@angular/core/testing';

// FIX: Import the correct class name from the correct file
import { OrderHistoryComponent } from './order-history';

// FIX: Update the describe block to use the correct name
describe('OrderHistoryComponent', () => {
  // FIX: Update type declarations
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // FIX: Import the correct component
      imports: [OrderHistoryComponent]
    })
    .compileComponents();

    // FIX: Create the component with the correct name
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});