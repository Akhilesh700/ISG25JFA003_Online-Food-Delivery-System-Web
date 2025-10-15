import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrderSummary } from 'src/app/models/iOrderSummary';
import { ZardTooltipDirective } from "@shared/components/tooltip/tooltip";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [ZardTooltipDirective, DecimalPipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css'
})
export class OrderSummary {


   /**
   * INPUT: The entire data object for the order summary.
   * The '!' tells TypeScript that we expect this to be provided by the parent.
   */
  @Input() summary: IOrderSummary = {
    
    subtotal: 800.00,
    promotion: 23.22, // Optional property
    deliveryFee: 46.00,
    deliveryDiscount: 8.00, // Optional property
    taxesAndFees: 128.23,
    oldTaxesAndFees: 200.00, // Optional for the strikethrough value
    total: 989.45

  };


  /**
   * OUTPUT: Emits an event when a user clicks an info icon.
   * This lets the parent component decide what to do (e.g., show a tooltip).
   */
  @Output() infoClicked = new EventEmitter<'deliveryFee' | 'taxesAndFees'>();

  /**
   * Emits which info icon was clicked.
   */
  onInfoClick(type: 'deliveryFee' | 'taxesAndFees'): void {
    this.infoClicked.emit(type);
  }
}
