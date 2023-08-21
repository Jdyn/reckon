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
				element: <Navigate to="/home" />
			},
			{
				path: 'home',
				element: <Home />
			},
			{
				path: 'group/:id',
				element: <Group />
			},
			{
				path: 'group',
				element: <Group />,
			}
		]
	}
]);

export default router;
