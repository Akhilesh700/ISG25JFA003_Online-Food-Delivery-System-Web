import { createReducer, on } from "@ngrx/store";
import { IDish, IResturant } from "src/app/models/resturantInterface";
import { addToCard, decrement, increment, removeFromCart } from "./cart.action";
import { inject } from "@angular/core";
import { ResturantService } from "src/app/core/services/customer/resturants/RestaurantService";


export interface CartState{
    dishes: IDish[],
    totalPrice: number,
    restaurant?: IResturant
}

export const initialCartState: CartState = {
    dishes: [],
    totalPrice: 0,
}


//Find Resturant by ResturantId
const findResturantById = (resturantId: number): IResturant => {
    const resturantService = new ResturantService();
    return resturantService.getResturantById(resturantId)
}

// Helper function to calculate the total price
const calculateTotalPrice = (dishes: IDish[]): number => {
    return dishes.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
};

export const cartReducer = createReducer(
    initialCartState,
    on(addToCard, (state, {dish}) => {
        const updatedDishes = [...state.dishes, {...dish, quantity: dish.quantity + 1} ]
        
        return {
            ...state,
            dishes: updatedDishes,
            totalPrice: calculateTotalPrice(updatedDishes),
            restaurant: findResturantById(1)
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
            dishes: updatedDishes,
            totalPrice: calculateTotalPrice(updatedDishes)
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
            dishes: updatedDishes,
            totalPrice: calculateTotalPrice(updatedDishes)
        }
    }),

    on(removeFromCart, (state, {dishId}) => {
        const updatedDishes = state.dishes.filter(d => d.id !== dishId)
        return {
            ...state,
            dishes: updatedDishes,
            totalPrice: calculateTotalPrice(updatedDishes)
        }
    })


     


)