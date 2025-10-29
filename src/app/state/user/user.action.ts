import { createAction, props } from "@ngrx/store";
import { IUserResponse } from "src/app/core/services/customer/user-profile/user-profile.service";


export const addUser = createAction('[User Component] AddUser', props<{user:IUserResponse}>());