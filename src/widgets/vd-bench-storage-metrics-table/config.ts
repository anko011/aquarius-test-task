import { HEADERS_MAPPING } from '@/entities/metrics';

/** Описание табличного представления для компонента {@link VDBenchStorageMetricsTable}*/
export const COLUMN_DESCRIPTIONS = {
	interval: { size: 0.1, label: HEADERS_MAPPING.interval, sortable: true },
	rate: { size: 0.2, label: HEADERS_MAPPING.rate, sortable: true },
	writeResp: { size: 0.2, label: HEADERS_MAPPING.writeResp, sortable: true },
	resp: { size: 0.1, label: HEADERS_MAPPING.resp, sortable: true },
	readResp: { size: 0.15, label: HEADERS_MAPPING.readResp, sortable: true },
	bandwidth: { size: 0.1, label: HEADERS_MAPPING.bandwidth, sortable: true },
};

/** Конфигурация компонента {@link VDBenchStorageMetricsTable} */
export const WIDGET_CONFIG = {
	/** Настройки сортировки и упорядочивания по умолчанию*/
	SORT: { column: 'interval', order: 'ASC' } as const,
	/** Открываемая страница пагинации по умолчанию */
	PAGE: 1,
	/** Количество строк отображаемых и загружаемых по сети*/
	PAGE_SIZE: 100,
};