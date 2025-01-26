import type { VDBenchStorageMetric } from './model';

export const HEADERS_MAPPING: Record<keyof VDBenchStorageMetric, string> = {
	'interval': 'Интервал',
	'rate': 'Операции ввода - вывода',
	'resp': 'Задержка',
	'bandwidth': 'Пропускная способность',
	'readResp': 'Задержка чтения',
	'writeResp': 'Задержка записи',
};
