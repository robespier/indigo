this.ink = new Array(7);

this.ink[0] = 0; // Opaque
this.ink[1] = 1; // Cyan
this.ink[2] = 0; // Magenta
this.ink[3] = 1; // Yellow
this.ink[4] = 1; // Black
this.ink[5] = 0; // Orange
this.ink[6] = 0; // Violet

/*
 * Избавимся от "магических чисел"
 */

IND_BLACK = 4;

/**
 * Переводит массив "0"/"1" из двоичной системы в десятичную
 *
 * @param dec Array
 * @return int
 */
function toDEC(dec) {
	var out = 0, len = dec.length, bit = 1;
	while(len--) {
		out += dec[len] == "1" ? bit : 0;
		bit <<= 1;
	}
	return out;
}

/**
 * Пример использования булевой арифметики
 * Определяет, установлены ли определенные биты сепараций
 * в десятичном числе ("Цветности задания")
 *
 * @param int num Цветность задания
 * @param int colors Сепарации
 *
 * @return boolean
 */
function isColorsPresent(num, colors) {
	var result = false;
	// Конструкция "num & colors" - это операция "побитовое И"
	if ((num & colors) !== 0) {
		result = true;
	}
	return result;
}

/**
 * Определяет hotfolder исходя из красочности задания
 *
 * @return string HotFolder Name
 */
function getHotFolder(num) { 
	var hotfolderName = '';
	if (num % 4 === 0) {
		if (num <= 60) {
			hotfolderName = "CMYK";
		} else {
			hotfolderName = "CMYKW";
		}
	} else {
		hotfolderName = "CMYKOW_White";
	}
	return hotfolderName;
}

var inkDec = toDEC(this.ink);
alert(isColorsPresent(inkDec,IND_BLACK));
alert(getHotFolder(inkDec));
