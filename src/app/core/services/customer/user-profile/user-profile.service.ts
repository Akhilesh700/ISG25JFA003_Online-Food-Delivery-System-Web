import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


export interface IUserResponse {
    name: string,
    email: string,
    dob: string,
    phone: string,
    address: string,
    preferredPayment: string
}


@Injectable({
    providedIn: 'root'
})
export class userProfileService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/customer`;

    getUserProfile() : Observable<IUserResponse> {
        return this.http.get<IUserResponse>(this.apiUrl);
    }   



}