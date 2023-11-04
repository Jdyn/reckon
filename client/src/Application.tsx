import { Flex } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { store } from '@reckon/core';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import router from '~/app/Router';
import { ErrorFallback } from '~/components/ErrorFallback';

import { ComposeProvider } from './app/Bills/Compose/ComposeProvider';
import './assets/styles/global.css';
import { ThemeProvider } from './hooks/ThemeProvider';

import '@reckon/ui/theme-config.css';

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
