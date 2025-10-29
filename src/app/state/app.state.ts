import { CartState } from "./cart/cart.reducer";
import { UserState } from "./user/user.reducer";

export interface AppState {
    cart: CartState,
    user: UserState
}