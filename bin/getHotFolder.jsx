this.ink = new Array(7);

this.ink[0] = 0; // Opaque
this.ink[1] = 1; // Cyan
this.ink[2] = 1; // Magenta
this.ink[3] = 1; // Yellow
this.ink[4] = 1; // Black
this.ink[5] = 0; // Orange
this.ink[6] = 1; // Violet

function toDEC(dec) { // Переводит число из двоичной системы в десятичную
	var out = 0, len = dec.length, bit = 1;
	while(len--) {
		out += dec[len] == "1" ? bit : 0;
		bit <<= 1;
	}
	return out;
}

function getHotFolder() { // Определяет hotfolder исходя из красочности задания
	var inkDec = toDEC(this.ink);
	var hotfolderName = '';
	if (inkDec % 4 === 0) {
		if (inkDec <= 60) {
			hotfolderName = "CMYK";
		} else {
			hotfolderName = "CMYKW";
		}
	} else {
		hotfolderName = "CMYKOW_White";
	}
	return hotfolderName;
}

alert(getHotFolder());
