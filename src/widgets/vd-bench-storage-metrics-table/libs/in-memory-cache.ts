import type { VDBenchStorageMetric } from '@/entities/metrics';
import type { PaginatedData } from '@/shared/api';
import type { OrderType } from '@/shared/common';

/** Кэш в памяти для компонента {@link VDBenchStorageMetricsTable} */
export const inMemoryCache = new Map<string, PaginatedData<VDBenchStorageMetric>>();

/**
 * Функция генерирующая ключ для кэша
 *
 * @param currentPage - Текущая страница пагинации
 * @param pageSize - Количество загружаемых строк
 * @param sortField - Ключ сортируемой колонки
 * @param sortOrder - Тип упорядочивания
 *
 */
export function createCacheKey(currentPage: number, pageSize: number, sortField: string, sortOrder: OrderType): string {
	return `${currentPage}-${pageSize}-${sortField}-${sortOrder}`;
}
