this.ink = new Array(7);

this.ink[0] = 0; // Opaque
this.ink[1] = 1; // Cyan
this.ink[2] = 0; // Magenta
this.ink[3] = 1; // Yellow
this.ink[4] = 0; // Black
this.ink[5] = 0; // Orange
this.ink[6] = 0; // Violet

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
 * Определяет, установлен ли бит "Black" в десятичном числе
 *
 * @return boolean
 */
function isBlack(num) {
	var result = false;
	// По соглашению, Black - третий бит, так что имя ему 4 в
	// десятичной системе счисления.
	// Конструкция "num & 4" это операция "побитовое И"
	if ((num & 4) != 0) {
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
alert(isBlack(inkDec));
alert(getHotFolder(inkDec));
