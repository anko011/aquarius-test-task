import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

export default {
	root: true,
	ignorePatterns: ['dist', 'node_modules'],
	overrides: [
		{
			files: ['**/*.{ts,tsx}'],
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
				project: './tsconfig.json',
			},
			settings: {
				react: {
					version: 'detect', // Автоматически определяет версию React
				},
			},
			env: {
				browser: true,
				es2021: true,
			},
			plugins: ['react-hooks', 'react-refresh', '@typescript-eslint'],
			extends: [
				js.configs.recommended,
				'plugin:react/recommended', // Рекомендации для React
				'plugin:react-hooks/recommended', // Рекомендации для хуков React
				'plugin:@typescript-eslint/recommended', // Основные правила TypeScript
				'plugin:@typescript-eslint/recommended-requiring-type-checking', // Строгая проверка TypeScript
			],
			rules: {
				// React и хуки
				'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
				'react/react-in-jsx-scope': 'off', // Не нужен импорт React в новых версиях
				'react/jsx-uses-react': 'off', // Отключено из-за нового JSX
				'react/prop-types': 'off', // Не используется с TypeScript

				// Хуки
				'react-hooks/rules-of-hooks': 'error', // Проверка правил хуков
				'react-hooks/exhaustive-deps': 'warn', // Проверка зависимостей хуков

				// TypeScript
				'@typescript-eslint/explicit-function-return-type': 'off', // Можно включить, если хотите строгий контроль типов
				'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Предупреждение о неиспользуемых переменных
				'@typescript-eslint/no-explicit-any': 'warn', // Минимизировать использование any
				'@typescript-eslint/consistent-type-imports': 'warn', // Рекомендуется использовать type imports
				'@typescript-eslint/no-floating-promises': 'error', // Предотвращает непреднамеренные невыполненные промисы

				// Общие правила
				'no-console': 'warn', // Предупреждение о console.log
				'no-debugger': 'error', // Ошибка при использовании debugger
				'prefer-const': 'error', // Использовать const там, где возможно
			},
		},
	],
};
