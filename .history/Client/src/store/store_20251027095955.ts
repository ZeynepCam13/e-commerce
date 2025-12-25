import { configureStore } from "@reduxjs/toolkit"
import { cartSlice } from "../features/cart/cartSlice"
import { catalogSlice } from "../features/catalog/catalogSlice"
import { accountSlice } from "../features/account/accountSlice"
import { useDispatch, useSelector } from "react-redux"
import favoritesSlice from "../features/favorites/FavoritesSlice"
import { commentSlice } from "../features/comments/commentSlice"

export const store = configureStore({
    reducer: {
        
        cart: cartSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer,
        favorites:favoritesSlice,
        comments: commentSlice.reducer,

    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

