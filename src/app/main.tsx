import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorHandler } from '@/shared/ui';

import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ErrorBoundary FallbackComponent={ErrorHandler}>
			<App />
		</ErrorBoundary>
	</StrictMode>,
);
