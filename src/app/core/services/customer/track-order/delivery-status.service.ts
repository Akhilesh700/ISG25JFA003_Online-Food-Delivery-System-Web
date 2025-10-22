import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn:'root'
})
export class DeliveryStatus{
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/deliveries`;
    
    
    getDeliveryStatus(orderId: number) : Observable<string> {
        return this.http.get(`${this.apiUrl}/${orderId}/delivery-status`, {responseType: 'text'});
    }
}