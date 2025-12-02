import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import requests from "../../api/requests";

export interface Comment{
    id:number;
    text:string;
    username:string;
    createdAt:string;
    productId:number;
}

interface CommentState{
    comments:Comment[];
    status:string;
}

const initialState: CommentState = {
  comments: [],
  status: "idle"
};

// 1️⃣ Belirli bir ürünün yorumlarını getir
export const fetchComments = createAsyncThunk<Comment[], number>(
  "comments/fetchComments",
  async (productId) => await requests.Comments.list(productId)
);

// 2️⃣ Yeni yorum ekle
export const addComment = createAsyncThunk<Comment, { productId: number; text: string }>(
  "comments/addComment",
  async (data) => await requests.Comments.add(data)
);

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.status = "idle";
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload); // Yeni yorumu listeye ekle
      });
  },
});

export default commentSlice.reducer;