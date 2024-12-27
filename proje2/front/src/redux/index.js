import { configureStore } from "@reduxjs/toolkit";
import coinProjectReducer from './slice/index'


export const store = configureStore({
    reducer : {
        coin : coinProjectReducer
    }
})
