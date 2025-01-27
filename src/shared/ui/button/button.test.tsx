import { fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

import { Button } from '.';

describe('Button', () => {
	it('should render with default styles', () => {
		render(<Button>Click Me</Button>);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Click Me');
	});


	it('should handle other props, such as onClick', () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click Me</Button>);
		const button = screen.getByRole('button');
		fireEvent.click(button);
		expect(onClick).toHaveBeenCalled();
	});

	it('should render with a type attribute', () => {
		render(<Button type="submit">Submit</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('type', 'submit');
	});

	it('should support disabled state', () => {
		render(<Button disabled>Click Me</Button>);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});
});
