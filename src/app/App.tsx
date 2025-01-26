import { VDBenchStorageMetricsInlineChart, VDBenchStorageMetricsTable } from '@/widgets';

/** Компонент представляющий собой композицию страницы*/
function App() {
	return (
		<main>
			<div>
				<h2>График</h2>
				<VDBenchStorageMetricsInlineChart />
			</div>
			<div>
				<h2>Таблица</h2>
				<VDBenchStorageMetricsTable />
			</div>
		</main>
	);
}

export default App;
