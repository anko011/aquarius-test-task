import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Pagination } from '.';

describe('Pagination Component', () => {
	const mockOnChangePage = vi.fn();

	afterEach(() => {
		mockOnChangePage.mockClear();
	});

	it('should display the correct page and the total number of pages.', () => {
		render(<Pagination page={1} totalPages={5} onChangePage={mockOnChangePage} />);
		expect(screen.getByText('Страница 1 из 5')).toBeInTheDocument();
	});

	it('should call onChangePage with the correct page when clicking on the "Далее" button', () => {
		render(<Pagination page={1} totalPages={5} onChangePage={mockOnChangePage} />);

		const nextButton = screen.getByText('Далее');
		fireEvent.click(nextButton);

		expect(mockOnChangePage).toHaveBeenCalledWith(2);
	});

	it('should call onChangePage with the correct page when clicking on the "Назад" button', () => {
		render(<Pagination page={3} totalPages={5} onChangePage={mockOnChangePage} />);

		const previousButton = screen.getByText('Назад');
		fireEvent.click(previousButton);

		expect(mockOnChangePage).toHaveBeenCalledWith(2);
	});

	it('the "Далее" button should be disabled on the last page', () => {
		render(<Pagination page={5} totalPages={5} onChangePage={mockOnChangePage} />);

		const nextButton = screen.getByText('Далее');
		expect(nextButton).toBeDisabled();
	});

	it('The "Назад" button should be disabled on the first page', () => {
		render(<Pagination page={1} totalPages={5} onChangePage={mockOnChangePage} />);

		const previousButton = screen.getByText('Назад');
		expect(previousButton).toBeDisabled();
	});

	it('it should not call onChangePage if the buttons are disabled', () => {
		render(<Pagination page={1} totalPages={5} onChangePage={mockOnChangePage} />);

		const previousButton = screen.getByText('Назад');
		fireEvent.click(previousButton);

		expect(mockOnChangePage).not.toHaveBeenCalled();
	});
});