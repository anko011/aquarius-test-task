import { ReactNode } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import cs from 'classnames';

import type { DataItem, DataKey, OrderType } from '@/shared/common';

import styles from './styles.module.css';

/** Описание колонки таблицы */
export type ColumnDescription = {
	/** Пропорция от 0 до 1 (не должна превышать 1 суммарно по всем колонкам) */
	size: number;
	/** Заголовок таблицы */
	label: string;
	/** Если true, то при нажатии на заголовок колонки будет вызвана функция {@link SortableTableProps.onChangeSort} */
	sortable?: boolean;
}

/**
 *  Описания колонок в виде объекта
 *
 * @typeParam T - Объект представления данных
 *
 */
export type TableColumnDescriptions<T extends DataItem> = Record<DataKey<T>, ColumnDescription>

/**
 *  Описание настроек сортировки и порядка отображения данных в таблице
 *
 *  @typeParam T - Объект представления данных
 *
 */
export type SortConfig<T extends DataItem> = {
	/** Ключ колонки */
	column: DataKey<T>;
	/** Тип упорядочивания */
	order: OrderType;
}

/**
 * Пропсы компонента {@link SortableTable}
 *
 * @typeParam T - Объект представления данных
 *
 */
export type SortableTableProps<T extends DataItem> = {
	/** Описания колонок */
	columns: TableColumnDescriptions<T>;
	/** Данные для отображения */
	data: T[];
	/** Настройки сортировки и упорядочивания */
	sortConfig: SortConfig<T>;
	/** Высота viewport части таблицы в которой отображаются данные */
	viewportHeight?: number;
	/** Высота заголовка таблицы */
	headerHeight?: number;
	/** Высота строки */
	rowHeight?: number;
	/** Если true, то будет отображен overflow блок блокирующий взаимодействие */
	isLoading?: boolean;
	/** Слот подвала компонента */
	footer?: ReactNode;
	/** Обработчик изменения настроек сортировки и упорядочивания */
	onChangeSort?: (sortConfig: SortConfig<T>) => void;
}

/**
 * Пропсы компонента {@link SortableColumnHeader}
 *
 * @typeParam T - Объект представления данных
 *
 * */
export type ColumnHeaderProps<T extends DataItem> = {
	/** Заголовок колонки */
	label: string;
	/** Ключ колонки */
	dataKey: DataKey<T>;
	/** Конфигурация сортировки и упорядочивания */
	sortConfig: SortConfig<T>;
	/** Если true, то будет добавлена иконка сортировки при совпадающих настройках */
	sortable?: boolean;
	/** Обработчик нажатия по заголовку */
	onClick?: (dataKey: DataKey<T>) => void;
}

/**
 * Компонент для отображения заголовков колонки
 *
 * Отображает заголовок колонки с индикатором сортировки
 *
 * @typeParam T - Объект представления данных
 * @param props - Пропсы компонента
 *
 * @example
 * <SortableColumnHeader
 *  sortable
 *  dataKey="interval"
 *  label="Интервал"
 *  sortConfig={{column: "resp", order: "ASC"}}
 *  onClick={() => console.log("Clicked the header")}
 * />
 */
export function SortableColumnHeader<T extends DataItem>(
	{
		onClick,
		label,
		dataKey,
		sortConfig,
		sortable = true,
	}: ColumnHeaderProps<T>,
) {
	const sortSymbol = sortConfig.order === 'ASC' ? '△' : '▽';
	return (
		<div className={styles.header}
				 onClick={() => sortable && onClick?.(dataKey)}
		>
			<span>{label}</span>
			{sortable && (
				<span>{sortConfig.column === dataKey ? sortSymbol : ''}</span>
			)}
		</div>
	);
}

/**
 * Компонент отражающий данные в табличном виде
 *
 * Строки выводятся виртуализированно
 *
 * @typeParam T - Объект представления данных
 * @param props - Пропсы компонента
 *
 * @example
 * <SortableTable
 *  isLoading
 *  data={[{interval: 1, resp: 1}, {interval: 2, resp: 2}]}
 *  sortConfig={{order: "ASC", column: "interval"}}
 *  onChangeSort={(sortConfig) => setSortConfig(sortConfig)}
 *  columns={{
 *   interval: { label: "Интервал", size: 0.5, sortable: true },
 *   rate: { label: "Задержка", size: 0.5, sortable: true },
 *  }}
 *  footer={ <footer>Подвальная часть</footer> }
 * />
 */
export function SortableTable<T extends DataItem>(
	{
		data,
		columns,
		sortConfig,
		footer,
		isLoading,
		onChangeSort,
		viewportHeight = 300,
		headerHeight = 40,
		rowHeight = 40,
	}: SortableTableProps<T>) {

	const handleClickHeader = (dataKey: DataKey<T>) => onChangeSort?.({
		column: dataKey,
		order: sortConfig.column === dataKey && sortConfig.order === 'ASC' ? 'DESC' : 'ASC',
	});

	return (
		<div role="table" className={cs(styles.root, isLoading && styles.loading)}>
			<div style={{ height: `${viewportHeight}px` }}>
				<AutoSizer>

					{({ height, width }) => (
						<Table
							width={width}
							height={height}
							headerHeight={headerHeight}
							rowHeight={rowHeight}
							rowCount={data.length}
							rowGetter={({ index }) => data?.[index] ?? ''}
							sortBy={sortConfig.column}
							sortDirection={sortConfig.order}
							noRowsRenderer={() => <div className={styles.noData}>Отсутствуют данные</div>}
						>
							{Object.keys(columns).map((dataKey, i) => {
								const key = dataKey as DataKey<T>;
								const column = columns[key];
								return (
									<Column
										key={i}
										dataKey={dataKey}
										width={column.size * width}
										label={column.label}
										headerRenderer={() => (
											<SortableColumnHeader dataKey={key}
																						label={column.label}
																						sortable={column.sortable}
																						sortConfig={sortConfig}
																						onClick={handleClickHeader}
											/>
										)}
									/>
								);
							})}
						</Table>
					)}

				</AutoSizer>
			</div>

			{footer}
		</div>
	);
}