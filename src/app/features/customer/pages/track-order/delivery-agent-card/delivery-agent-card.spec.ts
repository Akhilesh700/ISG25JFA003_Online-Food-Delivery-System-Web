import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAgentCard } from './delivery-agent-card';

describe('DeliveryAgentCard', () => {
  let component: DeliveryAgentCard;
  let fixture: ComponentFixture<DeliveryAgentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryAgentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryAgentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
