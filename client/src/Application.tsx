import '@radix-ui/themes/styles.css';
import { store } from '@reckon/core';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PhoenixProvider } from 'use-phoenix';
import { ErrorFallback } from '~/components/ErrorFallback';
import router from '~/app/Router';

import './assets/styles/global.css';
import { ThemeProvider } from './hooks/ThemeProvider';

import '@reckon/ui/theme-config.css';
import { Flex } from '@radix-ui/themes';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Provider store={store}>
				<PhoenixProvider>
					<ThemeProvider defaultTheme="light" storageKey="theme">
						<Flex direction="column"  align="center">
							<div style={{ maxWidth: '1380px', width: '100%'}}>
							<RouterProvider router={router} />
							</div>
						</Flex>
					</ThemeProvider>
				</PhoenixProvider>
			</Provider>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
