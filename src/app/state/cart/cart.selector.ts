import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { CartState } from "./cart.reducer";

export const selectCartState = (state: AppState ) => state.cart;

export const selectCartItems = createSelector(
    selectCartState,
    (state: CartState) => state.dishes
);

export const selectTotalPrice = createSelector(
    selectCartState,
    (state: CartState) => state.totalPrice
);