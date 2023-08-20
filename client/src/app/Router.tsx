import { RootLayout } from '@reckon/ui';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import HomeScreen from '~/app/Home/Overview';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/overview" />
			},
			{
				path: 'overview',
				element: <HomeScreen />
			},
			{
				path: 'home',
				element: <HomeScreen />
			}
		]
	}
]);

export default router;
