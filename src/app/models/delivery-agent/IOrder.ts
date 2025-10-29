
import {DeliveryAgentStatus} from './IDeliveryAgent'

export type OrderStatus = 'PLACED' | 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'NOT_ACCEPTED' | 'FAILED' | 'DELIVERED';

export interface IOrderHistroy {
    orderId: number;
    restaurant: string;
    customer: string;
    customerPhone: string;
    orderTime: string;
    pickUpAddress: string;
    deliveryAddress: string | null;
    status: OrderStatus
    totalAmount: number;
    totalOrderItems: number;
}