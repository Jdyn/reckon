import { configureStore } from '@reduxjs/toolkit';

import accountApi from './services/account/account';
import billApi from './services/bill/bill';
import groupApi from './services/group/group';

export const store = configureStore({
	reducer: {
		[accountApi.reducerPath]: accountApi.reducer,
		[groupApi.reducerPath]: groupApi.reducer,
		[billApi.reducerPath]: billApi.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat([accountApi.middleware, groupApi.middleware, billApi.middleware])
});
