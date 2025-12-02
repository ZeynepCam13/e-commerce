import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../model/IUser";
import { FieldValues } from "react-hook-form";
import requests from "../../api/requests";
import { router } from "../../router/Router";
import  jwtDecode  from "jwt-decode";



interface DecodedToken {
  nameid: string;
  unique_name: string;
  role?: string;
  exp: number;
  iat: number;
}
interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const loginUser = createAsyncThunk<User, FieldValues>(
    "account/login",
    async (data, {rejectWithValue}) => {
        try
        {
            const user=await requests.Account.login(data);
           const decoded: DecodedToken = jwtDecode(user.token);
           user.role = decoded.role;

    
         
          return user;
        }
        catch(error: any)
        {
            return rejectWithValue({error: error.data});
        }
    }
)

export const getUser = createAsyncThunk<User>(
  "account/getuser",
  async (_, thunkAPI) => {
    try {
      const user = await requests.Account.getUser();
      const decoded: DecodedToken = jwtDecode(user.token);
      user.role = decoded.role;
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      // token session veya local storage'da mı?
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return false;
    }
  }
);


export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            router.navigate("/login");
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            
        })
         builder.addCase(getUser.fulfilled, (state, action) => {
            state.user = action.payload;
        })
         builder.addCase(getUser.rejected, (state) => {
            state.user=null;
            localStorage.removeItem("user");
            router.navigate("/login");
            
        })
    })
})

export const { logout, setUser } =  accountSlice.actions;