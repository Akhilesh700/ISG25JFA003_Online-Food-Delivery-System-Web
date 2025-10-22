import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IDish } from "src/app/models/resturantInterface";
import { environment } from "src/environments/environment";

interface OrderItem {
    menuItemId: number,
    quantity: number
}

export interface CartRequest {
    orderItems: OrderItem[],
    note: string
}

export interface CartResponse {
    cartId: number;
}


@Injectable({
    providedIn:'root'
})
export class CartApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/cart`;

    saveCart(dishes: IDish[], note: string = ''): Observable<CartResponse> {
        const request : CartRequest = {
            orderItems : dishes.map(dish => ({
                menuItemId: dish.itemId,
                quantity: dish.quantity
            })),
            note: note
        }


        return this.http.post<CartResponse>(`${this.apiUrl}/add`, request);

    }
}