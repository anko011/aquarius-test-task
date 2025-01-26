/** Сущность описывающая характеристики СХД полученная в результате тестирования DBench */
export type VDBenchStorageMetric = {
	/** Интервал */
	interval: number;
	/** Операции ввода-вывода */
	rate: number;
	/** Задержка */
	resp: number;
	/** Пропускная способность */
	bandwidth: number;
	/** Задержка чтения */
	readResp: number;
	/** Задержка записи */
	writeResp: number;
}