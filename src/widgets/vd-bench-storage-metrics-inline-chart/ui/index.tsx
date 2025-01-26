import { useEffect, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import { HEADERS_MAPPING, type VDBenchStorageMetric, VDBenchStorageMetricsRepository } from '@/entities/metrics';
import { type AreaSelection, Button, IntervalLineChart, YAxisSelector, type YChartAxis } from '@/shared/ui';

import { WIDGET_CONFIG } from '../config';


/**
 * Компонент, осуществляющий визуализацию результатов нагрузочного тестирования системы хранения данных (СХД) с применением VDBench.
 * Представляет собой линейный график с выбором различных параметры.
 *
 * @example
 * <VDBenchStorageMetricsInlineChart />
 */
export function VDBenchStorageMetricsInlineChart() {
	type VDBenchStorageYAxis = YChartAxis<VDBenchStorageMetric, typeof WIDGET_CONFIG.X_AXIS>;

	const [data, setData] = useState<VDBenchStorageMetric[]>([]);
	const [dataKey, setDataKey] = useState<VDBenchStorageYAxis>(WIDGET_CONFIG.Y_AXIS);
	const [range, setZoomedRange] = useState<AreaSelection | null>();
	const [isLoading, setIsLoading] = useState(false);
	const { showBoundary } = useErrorBoundary();

	const yAxisOptions = Object.keys(data[0] || {}).filter((key) => key !== WIDGET_CONFIG.X_AXIS) as VDBenchStorageYAxis[];

	useEffect(() => {
		const { left, right } = range ?? {};

		setIsLoading(true);
		VDBenchStorageMetricsRepository
			.getDecimateMetrics(left, right)
			.then(setData)
			.catch(showBoundary)
			.finally(() => setIsLoading(false));

	}, [range]);

	return (
		<IntervalLineChart
			isLoading={isLoading}
			data={data}
			xAxis={WIDGET_CONFIG.X_AXIS}
			yAxis={dataKey}
			onChangeInterval={setZoomedRange}
			header={(
				<YAxisSelector
					yAxis={dataKey}
					options={yAxisOptions}
					headerMapping={HEADERS_MAPPING}
					onChangeYAxis={setDataKey}
				/>
			)}
			footer={(
				<Button onClick={() => setZoomedRange(null)}>
					Сбросить масштабирование
				</Button>
			)}
		/>
	);
}