import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../app/features/blogs/postsSlice";
import userReducer from "../app/features/user/userSlice";
import imageReducer from "../app/features/image/imageSlice";
import imageGalleryReducer from "../app/features/image/imageGallerySlice";
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    imageUpload: imageReducer,
    imageGallery: imageGalleryReducer,
  },
});
