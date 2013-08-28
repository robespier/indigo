this.ink = new Array(7);

this.ink[0] = 1; // Opaque
this.ink[1] = 1; // Cyan
this.ink[2] = 1; // Magenta
this.ink[3] = 1; // Yellow
this.ink[4] = 1; // Black
this.ink[5] = 0; // Orange
this.ink[6] = 0; // Violet

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
		switch(inkDec) {
			case 4:
			case 8:
			case 12:
			case 16:
			case 20:
			case 24:
			case 28:
			case 32:
			case 36:
			case 40:
			case 44:
			case 48:
			case 52:
			case 56:
			case 60:
				hotfolderName = 'CMYK'; // hotfolder CMYK
				break;
			case 68:
			case 72:
			case 76:
			case 80:
			case 84:
			case 88:
			case 92:
			case 96:
			case 100:
			case 104:
			case 108:
			case 112:
			case 116:
			case 120:
			case 124:
				hotfolderName = 'CMYKW'; // hotfolder CMYKW
		}
	} else {
		hotfolderName = "CMYKOW_White";
	}
	return hotfolderName;
}

alert(getHotFolder());
