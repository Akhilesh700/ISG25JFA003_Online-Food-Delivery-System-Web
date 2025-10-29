import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { DeliveryAgentStatus, IDeliveryAgent } from "src/app/models/delivery-agent/IDeliveryAgent";
import { IOrderHistroy } from 'src/app/models/delivery-agent/IOrder';
import { environment } from "src/environments/environment";




@Injectable({
    providedIn: 'root'
})
export class DeliveryAgentService {
    protected http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/delivery-agent`;

    getAgentProfile() : Observable<IDeliveryAgent> {
        return this.http.get<IDeliveryAgent>(`${this.apiUrl}/profile`);
    }

    getAgentStatus() : Observable<DeliveryAgentStatus> {
        const response =  this.http.get<DeliveryAgentStatus>(`${this.apiUrl}/status`);

        return response;
    }

    getAgentOrderHistory() : Observable<IOrderHistroy[]> {
        return this.http.get<IOrderHistroy[]>(`${this.apiUrl}/order-history`);
    }

    updateAgentStatus(status: DeliveryAgentStatus) : Observable<string> {
        const params = new HttpParams().set('status', status as string);
        return this.http.patch<string>(`${this.apiUrl}/change-status`, {}, {params: params});
    } 
    
    updateOrderStatus(orderId: number, statusId: number) {
        console.log('He called me I am in service', orderId, statusId);
        const header = new HttpHeaders({
            statusid: statusId
        })
        const response = this.http.put<boolean>(`${environment.apiUrl}api/${environment.version}/deliveries/${orderId}/status`, {}, {headers: header});
        response.subscribe({
            next: (value) => {
                console.log('Response gave me ', value);
            }
         })
        return response
    }
}