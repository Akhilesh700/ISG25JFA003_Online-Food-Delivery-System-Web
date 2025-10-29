import { createReducer, on } from "@ngrx/store";
import { addUser } from "./user.action";
import { IUserResponse } from "src/app/core/services/customer/user-profile/user-profile.service";
import { getInititalUserState } from "../metaReducer";

export interface UserState{
    user?: IUserResponse
}

export const initialUserState: UserState = getInititalUserState();

export const userReducer = createReducer(
    initialUserState,
    on(addUser, (state, {user}) => {
        console.log(user)
        return {
            ...state,
            user: user
        }
    })
)