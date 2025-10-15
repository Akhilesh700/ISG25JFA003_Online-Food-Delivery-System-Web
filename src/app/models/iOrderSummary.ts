export interface IOrderSummary {
  subtotal: number;
  promotion?: number; // Optional property
  deliveryFee: number;
  deliveryDiscount?: number; // Optional property
  taxesAndFees: number;
  oldTaxesAndFees?: number; // Optional for the strikethrough value
  total: number;
}