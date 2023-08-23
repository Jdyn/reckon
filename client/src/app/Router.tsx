import { RootLayout } from '../components/Layout/Layout';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Home from '~/app/Home';
import Group from './Group/Group';
import { Children } from 'react';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/feed" />
			},
			{
				path: 'feed',
				element: <Home />
			},
			{
				path: 'pay',
				element: <Home />
			},
			{
				path: 'groups',
				element: <Group />,
				children: [
					{
						path: ':id',
						element: <Group />
					},
				]
			}
		]
	}
]);

export default router;
