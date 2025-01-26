import { Button } from '../button';

/** Пропсы для компонента {@link ErrorHandler} */
export type ErrorHandlerProps = {
	/** Экземпляр ошибки */
	error: Error
	/** Функция для сброса и последующего повторного рендеринга */
	resetErrorBoundary?: (...args: any[]) => void
}

const isDevelopment = import.meta.env.DEV;

/**
 * Компонент для обработки и отображения ошибки возникшей в приложении.
 *
 * Отображает в dev mode сообщение об ошибке и стек, в prod mode - только сообщение. В обоих режимах отображается кнопка сброса ошибки.
 *
 * @param props - Пропсы компонента.
 *
 * @example
 * <ErrorBoundary FallbackComponent={ErrorHandler}>
 *  <App />
 * </ErrorBoundary>
 */
export function ErrorHandler({ error, resetErrorBoundary }: ErrorHandlerProps) {
	return (
		<div>
			<h3>Что-то пошло не так...</h3>
			{isDevelopment && (
				<>
					<ul className="error-messages">
						<li>{error.message}</li>
					</ul>
					<pre>{error.stack}</pre>
				</>
			)}
			<Button type="button" onClick={resetErrorBoundary}>
				Попробуйте вновь
			</Button>
		</div>
	);
}