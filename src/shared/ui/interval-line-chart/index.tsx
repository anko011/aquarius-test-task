import { ReactNode, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { type CategoricalChartState } from 'recharts/types/chart/types';
import cs from 'classnames';

import type { DataItem, DataKey } from '@/shared/common';

import styles from './styles.module.css';

/** Описание выделения на графике */
export type AreaSelection = {
	/** Левое значение по оси X */
	left: number;
	/** Правое значение по оси X */
	right: number;
};

/**
 * Тип для ключей осей Y
 * @typeParam T - Тип объекта данных
 * @typeParam K - Ключ, представляющий ось X
 */
export type YChartAxis<T extends DataItem, K extends keyof T> = Exclude<keyof T, K> & string;

/**
 * Пропсы для компонента {@link YAxisSelector}
 * @typeParam T - Тип объекта данных
 * @typeParam K - Ключ, представляющий ось X
 */
export type YAxisSelectorProps<T extends DataItem, K extends keyof T> = {
	/** Текущая ось Y */
	yAxis: YChartAxis<T, K>;
	/** Список доступных осей Y */
	options: YChartAxis<T, K>[];
	/** Соответствие осей Y их заголовкам */
	headerMapping?: Partial<Record<YChartAxis<T, K>, string>>;
	/** Обработчик изменения оси Y */
	onChangeYAxis?: (axis: YChartAxis<T, K>) => void;
};

/**
 * Компонент выбора оси Y
 * @typeParam T - Тип объекта данных
 * @typeParam K - Ключ, представляющий ось X
 *
 * @param props - Пропсы компонента
 *
 * @example
 * <YAxisSelector
 *  yAxis="rate"
 *  options={["rate", "resp"]}
 *  headerMapping={{rate: "Операции ввода-вывода", resp: "Задержка"}}
 *  onChangeYAxis={(yAxis) => setYAxis(yAxis)}
 * />
 */
export function YAxisSelector<T extends DataItem, K extends keyof T>(
	{
		yAxis,
		options,
		headerMapping,
		onChangeYAxis,
	}: YAxisSelectorProps<T, K>,
) {
	if (options.length === 0) return null;

	return (
		<label className={styles.selector}>
			<span>Выберите поле для оси Y:</span>
			<select
				value={yAxis}
				onChange={(e) => onChangeYAxis?.(e.target.value as YChartAxis<T, K>)}
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{headerMapping?.[option] ?? option}
					</option>
				))}
			</select>
		</label>
	);
}

/**
 * Пропсы для компонента {@link IntervalLineChart}
 * @typeParam T - Тип объекта данных
 * @typeParam K - Ключ, представляющий ось X
 */
export type IntervalLineChartProps<T extends DataItem, K extends keyof T> = {
	/** Массив данных */
	data: T[];
	/** Текущая ось Y */
	yAxis: YChartAxis<T, K>;
	/** Ось X */
	xAxis: DataKey<T>;
	/** Флаг загрузки */
	isLoading?: boolean;
	/** Дополнительный класс стилей */
	className?: string;
	/** Слот шапки */
	header?: ReactNode;
	/** Слот подвала */
	footer?: ReactNode;
	/** Высота графика */
	height?: number;
	/** Цвет линии графика */
	lineStroke?: string;
	/** Обработчик изменения интервала */
	onChangeInterval?: (intervalSelection: AreaSelection) => void;
};

/**
 * Компонент линейного графика с выбором оси Y и интервала
 * @typeParam T - Тип объекта данных
 * @typeParam K - Ключ, представляющий ось X
 *
 * @param props - Пропсы компонента
 *
 * @example
 * <IntervalLineChart
 *  isLoading
 *  data={[{interval: 1, rate: 1, resp: 1}, {interval: 2, rate: 2, resp: 2}]}
 *  xAxis="interval"
 *  yAxis="rate"
 *  onChangeInterval={(area) => setSelectionArea(area)}
 *  footer={(
 *   <Button onClick={() => setZoomedRange(null)}>
 *    Сбросить масштабирование
 *   </Button>
 *  )}
 * />
 */
export function IntervalLineChart<T extends DataItem, K extends keyof T>(
	{
		data,
		yAxis,
		xAxis,
		className,
		isLoading = false,
		header,
		footer,
		height = 400,
		lineStroke = '#8884d8',
		onChangeInterval,
	}: IntervalLineChartProps<T, K>,
) {
	const [refArea, setRefArea] = useState<Partial<AreaSelection>>({});


	const handleMouseDown = (e: CategoricalChartState) => {
		if (e?.activeLabel != null)
			setRefArea({ left: Number(e.activeLabel) });
	};

	const handleMouseMove = (e: CategoricalChartState) => {
		if (refArea?.left != null && e?.activeLabel != null)
			setRefArea({ ...refArea, right: Number(e.activeLabel) });
	};

	const handleMouseUp = () => {
		const { left, right } = refArea;
		if (left != null && right != null && left !== right) {
			const [start, end] = [left, right].sort((a, b) => a - b);
			onChangeInterval?.({ left: start, right: end });
		}
		setRefArea({});
	};

	return (
		<div
			data-testid="chart-wrapper"
			className={cs(className, styles.root, { [styles.loading]: isLoading })}
		>
			{data.length === 0 && <div className={styles.noData}>Отсутствуют данные</div>}

			{header}

			<ResponsiveContainer height={height}>
				<LineChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					className={styles.chart}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={xAxis} />
					<YAxis domain={['dataMin', 'dataMax']} />
					<Line type="linear" dot={false} dataKey={yAxis} stroke={lineStroke} />

					{refArea.left != null && refArea.right != null && (
						<ReferenceArea x1={refArea.left} x2={refArea.right} strokeOpacity={0.3} />
					)}
				</LineChart>
			</ResponsiveContainer>

			{footer}
		</div>
	);
}
