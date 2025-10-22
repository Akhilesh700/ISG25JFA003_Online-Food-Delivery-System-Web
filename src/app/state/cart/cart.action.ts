
import { createAction, props} from '@ngrx/store'
import { IDish, IResturant } from 'src/app/models/resturantInterface'

export const addToCard = createAction('[Cart Component] AddToCart', props<{dish:IDish, restaurant:IResturant}>())

export const increment = createAction('[Cart Component] Increment', props<{dishId:number}>())

export const decrement = createAction('[Cart Component] Decrement', props<{dishId:number}>())

export const removeFromCart = createAction('[Cart Component] RemoveFromCart', props<{dishId:number}>())

export const emptyCart = createAction('[Cart Component] EmptyCart')
