import { ActionReducer, Action } from "@ngrx/store";
import { CartState } from "./cart/cart.reducer";

const CART_STORAGE_KEY = 'myAppCartState';

export const localStorageSync = (reducer: ActionReducer<any>) : ActionReducer<any> => {
    return (state: any, action: Action) =>  {

        const nextState = reducer(state, action);

        if (nextState && nextState.cart) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextState.cart));
        }

        return nextState;
    };
} 


export const getInitialCartState = () : CartState => {
    const savedState = localStorage.getItem(CART_STORAGE_KEY);
    if(savedState) {
        try{
            return JSON.parse(savedState);
        }catch(e) {
            console.error("Error while parsing cart state" , e);
        }
    }
    // default return
    return {
        dishes: [],
        totalPrice: 0,
        restaurant: undefined
    }
}