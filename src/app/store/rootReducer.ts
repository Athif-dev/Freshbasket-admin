import { combineReducers } from "@reduxjs/toolkit";
import createProductReducer from "./slices/createProductSlice";

const rootReducer = combineReducers({
  createProduct: createProductReducer,
});

export default rootReducer;
