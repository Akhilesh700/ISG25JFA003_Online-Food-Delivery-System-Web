
import { createAction, props} from '@ngrx/store'
import { IDish } from 'src/app/models/resturantInterface'

export const addToCard = createAction('[Cart Component] AddToCart', props<{dish:IDish}>())

export const increment = createAction('[Cart Component] Increment', props<{dishId:number}>())

export const decrement = createAction('[Cart Component] Decrement', props<{dishId:number}>())

export const removeFromCart = createAction('[Cart Component] RemoveFromCart', props<{dishId:number}>())
