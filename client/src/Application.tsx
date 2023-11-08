import { store } from '@reckon/core';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import { ErrorFallback } from '~/components/ErrorFallback';
import { ComposeProvider } from './app/Bills/Compose/ComposeProvider';
import { ThemeProvider } from './hooks/ThemeProvider';
import router from '~/app/Router';

import '@radix-ui/themes/styles.css';
import './assets/styles/global.css';
import '~/assets/styles/theme-config.css';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<PhoenixProvider>
					<ThemeProvider defaultTheme="light" storageKey="theme">
						<ComposeProvider>
							<RouterProvider router={router} />
						</ComposeProvider>
					</ThemeProvider>
				</PhoenixProvider>
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
