import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IProduct } from "../../model/IProduct";
import requests from "../../api/requests";


interface FavoritesState{
    favorites:IProduct[];
    status:string;
}

const initialState:FavoritesState={
    favorites:[],
    status:"idle"
};

export const getFavorites=createAsyncThunk<IProduct[]>(
    "favorites/getFavorites",
    async()=>await requests.Favorites.list()
);

export const addFavorite=createAsyncThunk<IProduct,number>(
    "favorites/addFavorites",
    async(productId)=> {
        await requests.Favorites.add(productId)
        return(await requests.Catalog.details(productId)) as IProduct;
    }

)

export const removeFavorite = createAsyncThunk<void, number>(
  "favorites/removeFavorite",
  async (productId) =>{ await requests.Favorites.remove(productId)
  }

  
);

const favoritesSlice = 
createSlice({
    name:"favorites",
    initialState,
    reducers:{},
    extraReducers:(builder:any)=>{
        builder
           .addCase(getFavorites.fulfilled,(state:any,action:any)=>{
            state.favorites=action.payload;
           })
           .addCase(addFavorite.fulfilled, (state:any, action:any) => {
           state.favorites.push(action.payload);
            })
           .addCase(removeFavorite.fulfilled, (state:any, action:any) => {
           state.favorites = state.favorites.filter((f: { id: any; }) => f.id !== action.payload);
      });
    },
});

export default favoritesSlice.reducer;