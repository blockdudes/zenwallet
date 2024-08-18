import { configureStore } from '@reduxjs/toolkit'
import pageSelectorSlice from './features/pageSelector/pageSelectorSlice';

import getUserDataSlice from './features/getUserDataSlice';
import getERC20TokenSlice from './features/getERC20TokenSlice';


export const makeStore = () => {
  return configureStore({
    reducer: {
      pageSelector: pageSelectorSlice,
      getUserData: getUserDataSlice,
      getERC20Token: getERC20TokenSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    })
  })
}


// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']