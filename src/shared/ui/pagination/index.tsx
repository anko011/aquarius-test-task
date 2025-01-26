import styles from './styles.module.css';
import { Button } from '@/shared/ui';

/** Пропсы для компонента {@link Pagination} */
export type PaginationProps = {
	/** Текущая страница */
	page: number,
	/** Общее количество страниц */
	totalPages: number,
	/** Обработчик переключения страницы */
	onChangePage?: (page: number) => void;
};

/**
 * Компонент для отображения навигации между страницами.
 *
 * Отображает кнопки "Назад" и "Далее" для переключения между страницами.
 *
 * @param props - Пропсы компонента.
 *
 * @example
 * <Pagination page={1} totalPages={5} onChangePage={(page) => console.log(page)} />
 */
export function Pagination({ page, totalPages, onChangePage }: PaginationProps) {
	const handleNextPage = () => onChangePage?.(Math.min(page + 1, totalPages));
	const handlePreviousPage = () => onChangePage?.(Math.max(page - 1, 1));

	return (
		<div className={styles.root}>
			<Button onClick={handlePreviousPage} disabled={page === 1}>Назад</Button>
			<span>Страница {page} из {totalPages}</span>
			<Button onClick={handleNextPage} disabled={page >= totalPages}>Далее</Button>
		</div>
	);
}