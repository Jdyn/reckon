import { account, store } from '@reckon/core';
import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';

import AuthLayout from './Auth/AuthLayout';
import Login from './Auth/Login';
import Settings from './Auth/Settings';
import BillFeed from './Bills/BillFeed';
import NewGroup from './Group/new';
import { RootLayout } from './Layout';

// import { ErrorFallback } from './ErrorFallback';

const protectRoute = async () => {
	const { error } = await store.dispatch(account.initiate());
	if (error) {
		return redirect('/login');
	}

	return null;
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		loader: protectRoute,
		children: [
			{ index: true, element: <Navigate to="/feed" /> },
			{ path: 'home', element: <BillFeed type="user" /> },
			{ path: 'feed', element: <BillFeed type="global" /> },
			{
				path: 'group',
				children: [
					{
						path: 'new',
						element: <NewGroup />
					}
				]
			},
			{
				path: 'g/:id',
				children: [
					{
						index: true,
						element: <Navigate to="feed" />
					},
					{
						path: 'feed',
						element: <BillFeed type="group" />
					}
				]
			},
			{ path: 'settings', element: <Settings /> }
		]
	},
	{
		path: '/',
		element: <AuthLayout />,
		children: [
			{
				path: 'login',
				element: <Login />
			}
		]
	}
]);

export default router;
