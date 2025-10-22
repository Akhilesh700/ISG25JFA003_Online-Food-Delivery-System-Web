import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { toast } from "ngx-sonner";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

interface OrderItems {
    orderItemId: number,
    itemName: string,
    quantity: number,
    price: number
}

export interface IOrderInfoResponse {
    orderId: number,
    restaurantId: number,
    resturantName: string,
    restaurantImgUrl: string,
    customer: string,
    customerPhone: string,
    orderTime: string,
    pickUpAddress: string,
    deliveryAddress: string,
    status: string,
    totalOrderItems: OrderItems[]
}

@Injectable({
    providedIn:'root'
})
export class DeliveryStatus{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/customer/orders`;
    
    
    getDeliveryStatus(orderId: number) : Observable<IOrderInfoResponse> {
   
        return this.http.get<IOrderInfoResponse>(`${this.apiUrl}/${orderId}`);
        
       
    }
}