import { array, Infer, number, object, Struct } from 'superstruct';

/**
 * Функция конструктор, для построения контрактов предоставляющая данные постранично
 *
 * @typeParam T - Тип данных
 * @param dataContract - Контракт данных
 * */
export function createPaginatedContract<T>(dataContract: Struct<T>) {
	return object({
		data: array(dataContract),
		currentPage: number(),
		totalRows: number(),
		pageSize: number(),
	});
}

/**
 * Тип, который описывает данные в виде страниц
 *
 * @typeParam T - Тип данных
 * @property data - Данные
 * @property currentPage - Данные
 * @property totalRows - Данные
 * @property pageSize - Данные
 * */
export type PaginatedData<T> = Infer<ReturnType<typeof createPaginatedContract<T>>>;

