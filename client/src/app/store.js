import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import deliveryReducer from "../features/delivery/deliverySlice";
import packageReducer from "../features/packages/packageSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    deliveries: deliveryReducer,
    packages: packageReducer,



  },
});
