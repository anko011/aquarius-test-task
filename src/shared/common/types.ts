/** Объект представления данных*/
export type DataItem = Record<string, string | number>;

/**
 * Строчный ключ данных
 *
 * @typeParam T - Объект представления данных
 *
 */
export type DataKey<T extends DataItem> = keyof T & string;

/** Описание порядка сортировки */
export type OrderType = 'ASC' | 'DESC';