import { useEffect, useState } from 'react';
import 'react-virtualized/styles.css';
import { useErrorBoundary } from 'react-error-boundary';

import { type VDBenchStorageMetric, VDBenchStorageMetricsRepository } from '@/entities/metrics';
import { Pagination, SortableTable, type SortConfig } from '@/shared/ui';
import { type PaginatedData } from '@/shared/api';

import { COLUMN_DESCRIPTIONS, WIDGET_CONFIG } from '../config';
import { createCacheKey, inMemoryCache } from '../libs';

/**
 * Компонент, который визуализирует результаты нагрузочного тестирования системы хранения данных (СХД) с использованием VDBench.
 * Он представляет собой таблицу с различными характеристиками, которые можно сортировать по разным критериям.
 *
 * @example
 * <VDBenchStorageMetricsTable />
 */
export function VDBenchStorageMetricsTable() {
	const [paginatedData, setPaginatedData] = useState<PaginatedData<VDBenchStorageMetric> | null>(null);
	const [currentPage, setCurrentPage] = useState(WIDGET_CONFIG.PAGE);
	const [sortConfig, setSortConfig] = useState<SortConfig<VDBenchStorageMetric>>(WIDGET_CONFIG.SORT);
	const [isLoading, setIsLoading] = useState(false);
	const { showBoundary } = useErrorBoundary();

	const totalPages = paginatedData ? paginatedData.totalRows / WIDGET_CONFIG.PAGE_SIZE : 1;

	useEffect(() => {
		const cacheKey = createCacheKey(currentPage, WIDGET_CONFIG.PAGE_SIZE, sortConfig.column, sortConfig.order);

		if (inMemoryCache.has(cacheKey)) {
			setPaginatedData(inMemoryCache.get(cacheKey) ?? null);
			return;
		}

		setIsLoading(true);
		VDBenchStorageMetricsRepository.getMetrics(currentPage, WIDGET_CONFIG.PAGE_SIZE, sortConfig.column, sortConfig.order)
			.then((data) => {
				setPaginatedData(data);
				inMemoryCache.set(cacheKey, data);
			})
			.catch(showBoundary)
			.finally(() => setIsLoading(false));

	}, [currentPage, sortConfig.column, sortConfig.order]);

	return (
		<SortableTable
			data={paginatedData?.data ?? []}
			isLoading={isLoading}
			sortConfig={sortConfig}
			onChangeSort={setSortConfig}
			columns={COLUMN_DESCRIPTIONS}
			footer={
				(<Pagination page={currentPage}
										 totalPages={totalPages}
										 onChangePage={setCurrentPage} />
				)}
		/>
	);
}