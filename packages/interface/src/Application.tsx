import { store } from '@reckon/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ErrorFallback } from '~/ErrorFallback';
import router from '~/Router';
import './global.css';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
