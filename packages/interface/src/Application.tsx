import { store } from '@reckon/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ErrorFallback } from '~/ErrorFallback';
import AppRouter from '~/Router';

function ReckonInterface() {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<MemoryRouter>
				<Provider store={store}>
					<AppRouter />
				</Provider>
			</MemoryRouter>
		</ErrorBoundary>
	);
}

export default ReckonInterface;
