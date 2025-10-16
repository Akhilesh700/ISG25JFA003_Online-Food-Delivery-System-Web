import { ICart } from "./iCart";
import { IDish } from "./resturantInterface";

export interface ICartItem {
    cartItemId: number,
    quantity: number,
    price: number,
    menuItem: IDish,
    cart : ICart
}