import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import nodesReducer from "./slices/nodesSlice";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
