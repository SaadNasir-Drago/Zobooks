import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';

export const store = configureStore({
  reducer: {
    property: propertyReducer,
  },
});

// Infer the `AppDispatch` and `RootState` types from the store itself
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
