import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { IntervalLineChart, YAxisSelector } from '.';

global.ResizeObserver = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

describe('IntervalLineChart', () => {
	const mockData = [
		{ interval: 1, value1: 10, value2: 20 },
		{ interval: 2, value1: 15, value2: 25 },
		{ interval: 3, value1: 20, value2: 30 },
	];

	const mockOnChangeInterval = vi.fn();
	const mockOnChangeYAxis = vi.fn();

	it('should render a graph with data', () => {
		render(
			<IntervalLineChart<typeof mockData[number], 'interval'>
				data={mockData}
				yAxis="value1"
				xAxis="interval"
				onChangeInterval={mockOnChangeInterval}
			/>,
		);

		expect(screen.getByText('Выберите поле для оси Y:')).toBeInTheDocument();
		expect(screen.getByText('value1')).toBeInTheDocument();
		expect(screen.getByText('value2')).toBeInTheDocument();
	});

	it('should change the Y-axis when selecting a new value', () => {
		render(
			<YAxisSelector<typeof mockData[number], 'interval'>
				yAxis="value1"
				options={['value1', 'value2']}
				onChangeYAxis={mockOnChangeYAxis}
			/>,
		);

		const select = screen.getByRole('combobox');
		fireEvent.change(select, { target: { value: 'value2' } });
		expect(mockOnChangeYAxis).toHaveBeenCalledWith('value2');
	});
});
