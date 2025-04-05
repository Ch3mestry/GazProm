import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import nodesReducer from "./slices/nodesSlice";
import groupsReducer from "./slices/groupsSlice";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    groups: groupsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
