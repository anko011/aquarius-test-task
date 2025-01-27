import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ErrorHandler } from '.';

import.meta.env.DEV = true;

const error = new Error('Test error');
const resetErrorBoundaryMock = vi.fn();

describe('ErrorHandler', () => {
	it('should render the title and the button', () => {
		render(<ErrorHandler error={error} resetErrorBoundary={resetErrorBoundaryMock} />);
		const title = screen.getByText('Что-то пошло не так...');
		const button = screen.getByRole('button', { name: 'Попробуйте вновь' });

		expect(title).toBeInTheDocument();
		expect(button).toBeInTheDocument();
	});

	it('should show an error message and a stack in development.', async () => {
		vi.stubEnv('VITE_DEV', 'true');

		const { container } = render(<ErrorHandler error={error} resetErrorBoundary={resetErrorBoundaryMock} />);

		const errorMessage = await screen.findByText('Test error');
		expect(errorMessage).toBeInTheDocument();

		const preElement = container.querySelector('pre');
		expect(preElement).toBeInTheDocument();
		expect(preElement?.textContent).toContain('Error: Test error');
		expect(preElement?.textContent).toContain(error.stack);
	});

	it('should trigger reseterrorbinary when the button is clicked.', () => {
		render(<ErrorHandler error={error} resetErrorBoundary={resetErrorBoundaryMock} />);
		const button = screen.getByRole('button', { name: 'Попробуйте вновь' });
		fireEvent.click(button);

		expect(resetErrorBoundaryMock).toHaveBeenCalledTimes(1);
	});

	it('should not show the error stack in production mode.', () => {
		import.meta.env.DEV = false;

		render(<ErrorHandler error={error} resetErrorBoundary={resetErrorBoundaryMock} />);

		const errorStack = screen.queryByText(error.stack!);
		expect(errorStack).not.toBeInTheDocument();
	});
});