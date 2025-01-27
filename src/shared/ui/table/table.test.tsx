import { fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { SortableTable } from '.';


describe('SortableTable Component with Virtualization', () => {
	const mockOnChangeSort = vi.fn();
	const mockColumns = {
		name: { size: 0.5, label: 'Name' },
		age: { size: 0.5, label: 'Age' },
	};
	const mockData = [
		{ name: 'John', age: 25 },
		{ name: 'Alice', age: 30 },
		{ name: 'Bob', age: 20 },
		{ name: 'Charlie', age: 35 },
		{ name: 'David', age: 40 },
	];
	const mockSortConfig = { column: 'name', order: 'ASC' } as const;

	afterEach(() => {
		mockOnChangeSort.mockClear();
	});

	it('should call onChange Sort when clicking on the column header', () => {
		render(
			<SortableTable
				data={mockData}
				columns={mockColumns}
				sortConfig={mockSortConfig}
				onChangeSort={mockOnChangeSort}
				viewportHeight={300}
			/>,
		);

		const nameHeader = screen.getByText('Name');
		fireEvent.click(nameHeader);

		expect(mockOnChangeSort).toHaveBeenCalledWith({ column: 'name', order: 'DESC' });

		const ageHeader = screen.getByText('Age');
		fireEvent.click(ageHeader);

		expect(mockOnChangeSort).toHaveBeenCalledWith({ column: 'age', order: 'ASC' });
	});

	it('should display the sort symbol (△ or ▽)', () => {
		render(
			<SortableTable
				data={mockData}
				columns={mockColumns}
				sortConfig={mockSortConfig}
				onChangeSort={mockOnChangeSort}
				viewportHeight={300}
			/>,
		);

		const nameHeader = screen.getByText('Name').parentElement!;
		fireEvent.click(nameHeader);
		expect(nameHeader).toContainHTML('△');
	});

	it('should render the footer', () => {
		render(
			<SortableTable
				data={mockData}
				columns={mockColumns}
				sortConfig={mockSortConfig}
				onChangeSort={mockOnChangeSort}
				footer={<div>Footer content</div>}
				viewportHeight={300}
			/>,
		);

		expect(screen.getByText('Footer content')).toBeInTheDocument();
	});

});
