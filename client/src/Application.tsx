import '@radix-ui/themes/styles.css';
import { store } from '@reckon/core';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ErrorFallback } from '~/app/ErrorFallback';
import router from '~/app/Router';

import './assets/styles/global.css';
import { ThemeProvider } from './hooks/ThemeProvider';

import '@reckon/ui/theme-config.css';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<ThemeProvider defaultTheme="light" storageKey="theme">
					<RouterProvider router={router} />
				</ThemeProvider>
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
