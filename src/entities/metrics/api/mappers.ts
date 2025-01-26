import { type VDBenchStorageMetric } from '../model';
import { type VDBenchStorageDataItemContract } from './contract';

/** Функция конвертации данных с API во внутренней сущности {@link VDBenchStorageMetric}*/
export function toVDBenchStorageMetric(item: VDBenchStorageDataItemContract): VDBenchStorageMetric {
	return {
		bandwidth: Number(item['MB/sec']),
		rate: Number(item['rate']),
		interval: Number(item['interval']),
		resp: Number(item['resp']),
		readResp: Number(item['read_resp']),
		writeResp: Number(item['write_resp']),
	};
}

/** Объект соответствия ключей данных и внутренней сущности {@link VDBenchStorageMetric}*/
export const fieldsMapping: Record<keyof VDBenchStorageMetric, keyof VDBenchStorageDataItemContract> = {
	bandwidth: 'MB/sec',
	interval: 'interval',
	writeResp: 'write_resp',
	rate: 'rate',
	resp: 'resp',
	readResp: 'read_resp',
};