import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { IntervalLineChart, YAxisSelector } from '.';
import { Children, cloneElement } from 'react';

describe('IntervalLineChart', () => {
	const mockData = [
		{ interval: 1, value1: 10, value2: 20 },
		{ interval: 2, value1: 15, value2: 25 },
		{ interval: 3, value1: 20, value2: 30 },
	];

	const mockOnChangeYAxis = vi.fn();

	vi.mock('recharts', async (importOriginal) => ({
		...await importOriginal<typeof import('recharts')>(),
		ResponsiveContainer: (props: any) =>
			Children.map(props.children, child =>
				cloneElement(child, {
					width: 100,
					height: 100,
					style: {
						height: '100%',
						width: '100%',
						...child.props.style,
					},
				})),
	}));


	it('should render a graph', async () => {
		const { container } = render(
			<IntervalLineChart<typeof mockData[number], 'interval'>
				data={mockData}
				yAxis="value1"
				xAxis="interval"
			/>,
		);

		const allLines = container.querySelectorAll('.recharts-line .recharts-line-curve');
		expect(allLines).toHaveLength(1);

		const line = allLines[0];
		expect(line).not.toBeNull();

		expect(line).toHaveAttribute(
			'd',
			'M80,65L80,35L80,5',
		);

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
