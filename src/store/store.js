import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import authSlice from "./authSlice";
import storage from "redux-persist/lib/storage";
import { FLUSH, PERSIST, PURGE, REGISTER, REHYDRATE, PAUSE } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, PERSIST, PURGE, REGISTER, REHYDRATE, PAUSE],
      },
    });
  },
});

export default store;
