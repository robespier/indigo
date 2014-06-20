#indigo

Вёрстка спусков в `Adobe Illustrator CS3` с использованием `JavaScript`.  
(Индиго - это марка печатной машины)

##Установка

* `cd indigo\indigoWebApp`
* `npm install -g grunt-cli`
* `npm install`

##Использование

###Сборка

В командном интерпретаторе Windows:

* `cd indigo`
* `grunt`

###Запуск

В командном интерпретаторе Windows:

* `cd indigo\indigoWebApp`
* `node app.js`

В Extended Script Toolkit:

* `bin\Run.jsx`

###Тесты

#### Для Иллюстратора

Тесты собираются с общей сборкой, т.е. когда всем `grunt` наступает.

В Extended Script Toolkit:

* `bin\tests.js`

Результаты видны в JavaScript Console.

#### В браузере

В командном интерпретаторе Windows:

* `protractor indigoWebApp/test/protractor.conf.js`

###Сборка документации

* `cd indigo`
* `grunt docs`

##Зависимости

* `mongodb` с базой заданий


