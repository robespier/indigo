 function job(sizeX, sizeY, diam, designer, manager, name, customer, task, order, lak_select, lak_solid, klei, tis_hot, tis, kongrev, ink_0, ink_1, ink_2, ink_3, ink_4, ink_5, ink_6) {
   this.sizeX = sizeX;
   this.sizeY = sizeY;
   this.diam = diam;
   this.designer = designer; // Дизайнер
   this.manager = manager; // Менеджер
   this.name = name; // Наименование заказа
   this.customer = customer; // Заказчик
   this.task = task; // Номер паспорта (без d)
   this.order = order; // Номер заказа
   this.lak_select = lak_select; // Выборочный лак
   this.lak_solid = lak_solid; // Сплошной лак
   this.klei = klei;
   this.tis_hot = tis_hot;
   this.tis = tis;
   this.kongrev = kongrev;
   this.ink_0 = ink_0; // Краска
   this.ink_1 = ink_1; // Краска
   this.ink_2 = ink_2; // Краска
   this.ink_3 = ink_3; // Краска
   this.ink_4 = ink_4; // Краска
   this.ink_5 = ink_5; // Краска
   this.ink_6 = ink_6; // Краска
   }

sizeX = '69';
sizeY = '185';
diam = ' ';
designer = 'Сергеев Р.'; // Дизайнер
manager = 'Исламов Р.'; // Менеждер
name = 'Мед цветочный Абрико 500 г'; // Наименование заказа
customer = 'Пищехимпродукт ООО'; // Заказчик
task = '3160068'; // Номер задания (без d)
order = '114Ц00370'; // Номер заказа
lak_select = 0;  // Выборочный лак
lak_solid = 1; // Сплошной лак
klei = 0;
tis_hot = 0;
tis = 0;
kongrev = 0;
ink_0 = 0; // Opaque
ink_1 = 1; // Cyan
ink_2 = 1; // Magenta
ink_3 = 1; // Yellow
ink_4 = 1; // Black
ink_5 = 0; // Orange
ink_6 = 0; // Violet

job1 = new job(this.sizeX, this.sizeY, this.diam, this.designer, this.manager, this.name, this.customer, this.task, this.order, this.lak_select, this.lak_solid, this.klei, this.tis_hot, this.tis, this.kongrev, this.ink_0, this.ink_1, this.ink_2, this.ink_3, this.ink_4, this.ink_5, this.ink_6);

db_name = 'db_emulation';
tempFolder = new Folder('D:\\work\\temp');
tempFile = new File(tempFolder + '\\' + db_name + '.txt');
tempFile.open('e');
tempFile.write(job1.toSource());
tempFile.close;
