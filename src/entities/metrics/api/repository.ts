import { csv } from 'd3';

import { type PaginatedData } from '@/shared/api';
import { type OrderType } from '@/shared/common';


import { type VDBenchStorageMetric } from '../model';
import { fieldsMapping, toVDBenchStorageMetric } from './mappers';
import {
	GetDecimatedVDBenchStorageMetricsContract,
	GetPaginatedVDStorageMetricsContract,
	VDBenchStorageDataItemContract,
} from './contract';

const LOADING_DELAY = 500;
const PREFER_STEP = 100;

const DATA = (await csv('/output.csv')).map(d => ({
	interval: +d.interval,
	rate: +d.rate,
	resp: +d.resp,
	'MB/sec': +d['MB/sec'],
	read_resp: +d.read_resp,
	write_resp: +d.write_resp,
})) as VDBenchStorageDataItemContract[];


function filterAndDecimateData(
	data: { interval: number }[],
	startInterval?: number,
	endInterval?: number,
) {
	const filteredData = data.filter(
		(item) => item.interval >= (startInterval ?? 0) && item.interval <= (endInterval ?? data.at(-1)!.interval),
	);
	const step = Math.max(Math.floor(filteredData.length / PREFER_STEP), 1);
	return filteredData.filter((_, index) => index % step === 0);
}

function paginateData<T>(
	data: T[],
	page: number,
	pageSize: number,
	sortField?: keyof T,
	sortOrder: 'ASC' | 'DESC' = 'ASC',
): PaginatedData<T> {
	const sortedData = sortField
		? [...data].sort((a, b) => {
			if (a[sortField] < b[sortField]) return sortOrder === 'ASC' ? -1 : 1;
			if (a[sortField] > b[sortField]) return sortOrder === 'ASC' ? 1 : -1;
			return 0;
		})
		: data;

	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	return {
		data: sortedData.slice(startIndex, endIndex),
		currentPage: page,
		totalRows: data.length,
		pageSize: pageSize,
	};
}

/**
 * Внешнее хранилище для метрик СХД полученных при тестировании при помощи VDBench
 *
 * Данный класс эмулирует запросы к серверу, используя данные /output.csv
 */
export class VDBenchStorageMetricsRepository {
	/**
	 * Метод получения в виде дакадационных данных для графиков.
	 * Внимание! Декадация данных осуществляется при помощи выбора по шагу элементов, вероятна потеря точности на графике
	 *
	 * @param startInterval - Начальный интервал
	 * @param endInterval - Конечный интервал
	 *
	 * */
	static async getDecimateMetrics(
		startInterval?: number,
		endInterval?: number,
	) {
		return new Promise<VDBenchStorageMetric[]>((resolve) =>
			setTimeout(
				() => {
					const result = filterAndDecimateData(DATA, startInterval, endInterval);
					if (GetDecimatedVDBenchStorageMetricsContract.is(result)) resolve(result.map(toVDBenchStorageMetric));
				},
				LOADING_DELAY,
			),
		);
	}

	/**
	 * Метод получения данных по странично
	 *
	 * @param page - Номер страницы
	 * @param pageSize - Количество элементов на странице
	 * @param sortField - Поле сортировки
	 * @param sortOrder - Тип сортировки
	 *
	 * */
	static async getMetrics(page: number = 1, pageSize: number = 10, sortField?: keyof VDBenchStorageMetric, sortOrder: OrderType = 'ASC') {
		const contractSortField = sortField && fieldsMapping[sortField] as keyof VDBenchStorageDataItemContract;
		return new Promise<PaginatedData<VDBenchStorageMetric>>((resolve) => {
			const result = paginateData(DATA, page, pageSize, contractSortField, sortOrder);
			setTimeout(() => {
				if (GetPaginatedVDStorageMetricsContract.is(result)) resolve({
					...result,
					data: result.data.map(toVDBenchStorageMetric),
				});
			}, LOADING_DELAY);
		});
	}
}