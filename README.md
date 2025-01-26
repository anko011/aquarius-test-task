# Обзор решения

## Инструкция запуска

Сформировать docker контейнер:

```bash
docker build -t perflab .
docker run -p 8080:8080 perflab
```

Перейти в браузере на:

+ [http://localhost:8080](http://localhost:8080) - приложение
+ [http://localhost:8080/docs](http://localhost:8080/docs) - документация


[Краткий обзор принципов архитектуры и выбранных библиотек](architecture.md)

## О задании

Задание заключалось в разработке веб-приложения, которое должно было бы визуализировать данные из CSV-файла. Основной
функциональностью приложения были графики и таблицы с возможностью сортировки данных, что позволило бы удобно
анализировать результаты тестирования.

## Общий обзор приложения

Приложение отображает данные графически с возможностью выбора метрик (rate, resp, MB/sec, read_resp, write_resp) для
анализа. Пользователь может изменять интервалы и использовать зум для детального анализа.

Кроме графика, доступна таблица с результатами тестирования, где данные можно сортировать по любому столбцу для удобства
анализа.

## Структура приложения по слоям

### Слой - app

Инициализация приложения происходит в файле main.tsx, где подключается основной компонент и выполняется начальная
настройка.

Основная структура приложения реализована в App.tsx, который управляет размещением компонентов, таких как график,
таблица и элементы управления.

Глобальные стили определены в index.css, где заданы базовые стили, включая шрифты, отступы и цветовые схемы для единого
внешнего вида.

### Слой - widgets

Этот слой отвечает за создание независимых и переиспользуемых виджетов, таких как таблица и график, разделённых на
слайсы для удобства поддержки.

+ ui — содержит компоненты интерфейса для таблицы и графика.
+ config — хранит статические настройки для визуализации.
+ libs — включает утилитарные функции для работы с данными.

Виджет таблицы использует InMemoryCache для повышения производительности. В более сложных приложениях логику кэширования
можно переместить в слой shared для централизованного управления состоянием данных. Для кэширования и синхронизации
данных можно использовать библиотеки, такие как TanStack React Query.

### Слой - entities

Слой entities отвечает за преобразование данных в сущности, используемые в приложении. В рамках модуля metrics
реализована логика получения и обработки данных, включая сущность VDBenchStorageMetric для работы с метками нагрузочного
тестирования СХД.

Модуль api эмулирует запросы к серверу. В реальном приложении предполагается:

+ Декадация данных для графика с использованием алгоритма Дугласа-Пекера для уменьшения объема передаваемых данных с
  сохранением формы графика. В данной реализации происходит выборка строк согласно шагу (старается вывести 100 строк),
  вследствие этого потеря формы графика.
+ Пагинация и сортировка данных на сервере для работы с большими объемами данных.

В текущем проекте не используются фактические запросы, однако в реальном приложении для работы с сервером применялись
бы HTTP-клиенты, такие как axios, размещённые в слое shared для централизованного управления запросами.

### Слой - shared

Слой shared отвечает за переиспользуемые компоненты, типы данных и вспомогательные элементы, обеспечивая гибкость и
повторное использование кода. Включает рендер-компоненты, такие как Button и IntervalLineChart, которые могут отображать
любые данные без привязки к бизнес-логике.

В более сложных проектах здесь реализуются инфраструктурные сущности, такие как:

+ Кэширование данных для улучшения производительности.
+ Сервисы для работы с localStorage.
+ Управление маршрутизацией.

В данном проекте shared выполняет роль "общего" хранилища для компонентов и утилит, что упрощает поддержку и расширение
приложения. Также для каждого модуля предусмотрена точка реэкспорта, упрощающая использование и уменьшающая количество
зависимостей.

## Тестирование

Поскольку слой shared представляет собой глобальную зависимость и изменения в компонентах на этом уровне могут повлиять
на вышележащие слои, компоненты этого слоя должны быть максимально стабильными и протестированными. Для обеспечения
надежности и предотвращения ошибок, тестирование этих компонентов является важным этапом разработки.

В связи с этим в проекте были написаны примеры тестов для компонентов слоя shared, чтобы гарантировать их корректную
работу и предотвратить возможные регрессии при внесении изменений в будущем.

## Сборка и деплой

Для сборки проекта был использован Vite, который обеспечивает быструю и эффективную сборку проекта. Раздачу статики и
gzip сжатие обеспечивается при помощи nginx. Для упрощения развертывания на других устройствах и локальной разработки
был написан Dockerfile, что позволяет запускать проект в контейнере без необходимости сложной настройки окружения.


