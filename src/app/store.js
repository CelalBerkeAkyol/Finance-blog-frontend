import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../app/features/blogs/postsSlice";
import userReducer from "../app/features/user/userSlice";
import userListReducer from "../app/features/user/userListSlice";
import teamReducer from "../app/features/user/teamSlice";
import imageReducer from "../app/features/image/imageSlice";
import imageGalleryReducer from "../app/features/image/imageGallerySlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    userList: userListReducer,
    team: teamReducer,
    imageUpload: imageReducer,
    imageGallery: imageGalleryReducer,
  },
});
