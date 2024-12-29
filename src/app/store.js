import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "../app/features/blogs/blogSlice";
export const store = configureStore({
  reducer: { blogs: blogsReducer },
});
