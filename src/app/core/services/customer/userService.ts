import { Injectable } from "@angular/core";


export interface IUser {
    userId: string,
    name: string,
    email: string,
    phone: string
    avatarUrl: string,
    location: string
}

@Injectable({
    providedIn: 'root'
})
export class userService{
    userDetails:IUser = {
    userId: '123',
    name: 'Eren Yeager',
    email: 'eren@shiganshina.com',
    phone: '+91 7757089263',
    avatarUrl: 'https://i.pinimg.com/originals/d4/69/49/d469498d11bed69e289d8dacc8b7eae9.jpg',
    location: 'Coimbatore, In'
  }

  useCurrentUser() : IUser{
    return this.userDetails;
  }





}