import { createReducer, on } from "@ngrx/store";
import { IDish, IResturant } from "src/app/models/resturantInterface";
import { addToCard, decrement, emptyCart, increment, removeFromCart } from "./cart.action";



export interface CartState{
    dishes: IDish[],
    totalPrice: number,
    restaurant?: IResturant
}

export const initialCartState: CartState = {
    dishes: [],
    totalPrice: 0,
    restaurant: undefined
}

// Helper function to calculate the total price
const calculateTotalPrice = (dishes: IDish[]): number => {
    return dishes.reduce((total, dish) => total + (dish.price * dish.quantity), 0);
};

export const cartReducer = createReducer(
    initialCartState,
    on(addToCard, (state, {dish, restaurant}) => {
        if (state.restaurant && state.restaurant.id !== restaurant.id) {
            // Todo: Make it sooner
            alert("You can only order from one restaurant at a time. Please clear your cart first.");
            return state; // Return the state unchanged
        }
        const updatedDishes = [...state.dishes, {...dish, quantity: dish.quantity + 1} ]
        
        return {
            ...state,
            dishes: updatedDishes,
            totalPrice: calculateTotalPrice(updatedDishes),
            // if its first time add rest for all cart
            restaurant: state.restaurant || restaurant
        }
    }),

    on(increment, (state, {dishId}) => {
        const updatedDishes = state.dishes.map(d => d.itemId === dishId ? {
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
        const updatedDishes = state.dishes.map(d => d.itemId === dishId ? {
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
        const updatedDishes = state.dishes.filter(d => d.itemId !== dishId)
        return {
            ...state,
            dishes: updatedDishes,
            totalPrice: calculateTotalPrice(updatedDishes)
        }
    }),

    on(emptyCart, () => {
        return initialCartState
    })


     


)