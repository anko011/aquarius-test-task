import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import cs from 'classnames';

import styles from './styles.module.css';

/**
 * Пропсы для компонента {@link Button}.
 */
export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

/**
 * Компонент отображающий стилизованную кнопку.
 *
 * @param props - Стандартные пропсы тега button
 *
 * @example
 * <Button className={styles.btn} onClick={(e) => console.log(e.target)} disabled>Click me!</Button>
 */
export function Button({ className, ...rest }: ButtonProps) {
	return (
		<button className={cs(className, styles.root)} {...rest} />
	);
}
