import { Navigate, createBrowserRouter } from 'react-router-dom';
import RootLayout from '~/Layout';
import HomeScreen from '~/screens/Overview';

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
			}
		]
	}
]);

export default router;
