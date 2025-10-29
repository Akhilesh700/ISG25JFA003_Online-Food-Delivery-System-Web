export interface Order {
  id: string;
  customerName: string;
  date: string;
  price: string;
  status: 'Completed' | 'Pending' | 'Rejected';
}
