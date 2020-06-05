[![npm version](https://badge.fury.io/js/vuex-map.svg)](https://badge.fury.io/js/vuex-map)
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

- [Оригинальный issue](https://github.com/vuejs/vuex/issues/1762)

## Какую проблему решает?

Аддон добавляет два новых маппера - `mapData` и `mapMethods`.

`mapData` заменяет `mapState` и `mapGetters`. Работает как `mapGetters`, но в случае, если не находит подходящий геттер, ищет переменную в state и возвращает ее.

Аналогично, `mapMethods` заменяет `mapMutations` и `mapActions`. Работает как `mapActions`, но если не находит экшн с данным именем, находит по этому имени мутацию и коммит её.

> `mapData` и `mapMethods` неустоявшиеся названия. Вы можете предложить свои в [этом issue](https://github.com/evgeniyPP/vuex-map/issues/1).

## Установка

> Требует vuex@^3.4.0 (>=3.4.0 <4.0.0). В иных случаях, загрузит в `node_modules` копию Vuex подходящей версии.

```bash
npm i vuex-map
```

```javascript
import { mapData, mapMethods } from 'vuex-map';

export default {
  ...
}
```

## Использование

**Можете использовать обычный Vuex синтаксис.**

#### `mapData`

Используйте `mapData`, если хотите получить значение из `state` или `getters`.

```javascript
computed: mapData(['text'])
```

или

```javascript
computed: {
  ...mapData(['text'])
}
```

#### `mapData` с модулями

При работе с модулями `mapData` добавляет некоторые ограничения:

- **Все модули должны быть `namespaced: true`**;
- Единственный доступный синтаксис –

```javascript
mapData("<имя модуля>", { <переменная>: "<ключ геттера/значения>" })
```

Например:

```javascript
computed: mapData('some/nested/module', {
  count: 'count'
})
```

Вы все ещё можете использовать синтаксис массива при работе со значениями/геттерами из глобального модуля.

#### `mapMethods`

Используйте `mapMethods`, если хотите получить методы из `mutations` или `actions`.

Синтаксис обычный для vuex, ничего особенного.

```javascript
methods: mapMethods(['increment'])
```

```javascript
methods: {
  ...mapMethods(['increment'])
}
```

С модулями:

```javascript
methods: mapMethods('some/nested/module', ['increment'])
```

## В планах:

- Написать тесты (уже на подходе);
- Уменьшить минимальные требования к версии Vuex;
- Обзавестись своим рабочим окружением. Пока используются скрипты от vuex.