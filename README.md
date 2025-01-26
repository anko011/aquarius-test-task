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

## Архитектура приложения

В качестве архитектурного подхода был выбран SPA (Single Page Application), так как этот подход идеально подходит для
внутреннего веб-приложения с динамическим и интерактивным интерфейсом. В отличие от SSR (Server-Side Rendering), SPA не
требует сложной серверной настройки, так как весь контент генерируется на клиенте, что упрощает конфигурацию и
развертывание.

### Основными преимуществами SSR перед SPA являются:

SSR улучшает SEO за счет готовой разметки и снижает нагрузку на клиент, так как вычисления выполняются на сервере.
Однако для высокоинтерактивных проектов (например, с графиками и таблицами) SPA подходит лучше, так как обеспечивает
большую динамичность и отзывчивость.

Для тестового задания было выбрано SPA, что позволило сократить время разработки и упростить архитектуру.

Проект структурирован с использованием Feature Slice Design (FSD), что повышает гибкость и масштабируемость. FSD
улучшает модульность, снижает связанность компонентов, облегчает тестирование и поддержку, а также упрощает добавление
новых функций.

### Основные принципы FSD

Методология FSD разделяет приложение на слои с однонаправленной зависимостью, что обеспечивает модульность и
устойчивость к изменениям. Слои организованы следующим образом:

+ app: Инициализация проекта, маршруты, провайдеры, глобальная конфигурация.
+ pages: Страницы приложения, каждая из которых состоит из виджетов и функциональных блоков.
+ widgets: Повторно используемые интерфейсные блоки с логикой.
+ features: Реализация функционала, ориентированного на взаимодействие с пользователем.
+ entities: Переиспользуемые компоненты, связанные с бизнес-логикой.
+ shared: Утилиты, компоненты, библиотеки, типы, не связанные с бизнес-логикой.

Каждый слой (кроме app и shared) делится на модули:

+ api: Взаимодействие с внешними API.
+ model: Обработка данных и бизнес-правила.
+ ui: Компоненты интерфейса.
+ config: Статическая конфигурация модуля.

### Слои определенные в приложении

#### Слой - app

Инициализация приложения происходит в файле main.tsx, где подключается основной компонент и выполняется начальная
настройка.

Основная структура приложения реализована в App.tsx, который управляет размещением компонентов, таких как график,
таблица и элементы управления.

Глобальные стили определены в index.css, где заданы базовые стили, включая шрифты, отступы и цветовые схемы для единого
внешнего вида.

#### Слой - widgets

Этот слой отвечает за создание независимых и переиспользуемых виджетов, таких как таблица и график, разделённых на
слайсы для удобства поддержки.

+ ui — содержит компоненты интерфейса для таблицы и графика.
+ config — хранит статические настройки для визуализации.
+ libs — включает утилитарные функции для работы с данными.

Виджет таблицы использует InMemoryCache для повышения производительности. В более сложных приложениях логику кэширования
можно переместить в слой shared для централизованного управления состоянием данных. Для кэширования и синхронизации
данных можно использовать библиотеки, такие как TanStack React Query.

#### Слой - entities

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

#### Слой - shared

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

### Подход Page-First

Подход Page-First основан на идее декомпозиции компонентов по мере необходимости. Компоненты располагаются как можно
ближе к месту их использования, что позволяет минимизировать количество «слоёв» и обеспечивает более эффективный и
органичный дизайн.
FSD основывается на концепции «высокой связности и низкой связанности» (High Cohesion, Low Coupling), что позволяет
создавать более структурированные и управляемые приложения.

### Подход рендер- и контейнер-компонентов

В рамках FSD используется подход, основанный на разделении компонентов на две категории: контейнерные и
рендер-компоненты:

+ Рендер-компоненты отвечают исключительно за визуализацию данных и управление состоянием, необходимым для отображения.
+ Контейнерные компоненты обеспечивают композицию рендер-компонентов и включают логику обработки данных, а также
  взаимодействие с API.

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

[Используемые зависимости и возможные их аналоги](why_this_library.md)

