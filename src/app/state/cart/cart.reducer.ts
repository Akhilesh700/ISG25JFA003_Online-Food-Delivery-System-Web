import { createReducer, on } from "@ngrx/store";
import { IDish } from "src/app/models/resturantInterface";
import { addToCard, decrement, increment, removeFromCart } from "./cart.action";


export interface CartState{
    dishes: IDish[],
    totalPrice?: number
}

export const initialCartState: CartState = {
    dishes: [],
}

export const cartReducer = createReducer(
    initialCartState,
    on(addToCard, (state, {dish}) => {
        const updatedDishes = [...state.dishes, {...dish, quantity: dish.quantity + 1} ]
        
        return {
            ...state,
            dishes: updatedDishes
        }
    }),

    on(increment, (state, {dishId}) => {
        const updatedDishes = state.dishes.map(d => d.id === dishId ? {
            ...d,
            quantity: d.quantity + 1}
            :
            d
        )
        return {
            ...state,
            dishes: updatedDishes
        }
    }),

    on(decrement, (state, {dishId}) => {
        const updatedDishes = state.dishes.map(d => d.id === dishId ? {
            ...d,
            quantity: d.quantity - 1}
            :
            d
        )
        return {
            ...state,
            dishes: updatedDishes
        }
    }),

    on(removeFromCart, (state, {dishId}) => {
        const updatedDishes = state.dishes.filter(d => d.id !== dishId)
        return {
            ...state,
            dishes: updatedDishes
        }
    })


     


)