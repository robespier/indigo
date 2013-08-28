this.ink = new Array(7);

this.ink[0] = 0; // Opaque
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
			break;				
		case 1:
		case 2:
		case 3:
		case 5:
		case 6:
		case 7:
		case 9:
		case 10:
		case 11:
		case 13:
		case 14:
		case 15:
		case 17:
		case 18:
		case 19:
		case 21:
		case 22:
		case 23:
		case 25:
		case 26:
		case 27:
		case 29:
		case 30:
		case 31:
		case 33:
		case 34:
		case 35:
		case 37:
		case 38:
		case 39:
		case 41:
		case 42:
		case 43:
		case 45:
		case 46:
		case 47:
		case 49:
		case 50:
		case 51:
		case 53:
		case 54:
		case 55:
		case 57:
		case 58:
		case 59:
		case 61:
		case 62:
		case 63:
		case 69:
		case 70:
		case 71:
		case 73:
		case 74:
		case 75:
		case 77:
		case 78:
		case 79:
		case 81:
		case 82:
		case 83:
		case 85:
		case 86:
		case 87:
		case 89:
		case 90:
		case 91:
		case 93:
		case 94:
		case 95:
		case 97:
		case 98:
		case 99:
		case 101:
		case 102:
		case 103:
		case 105:
		case 106:
		case 107:
		case 109:
		case 110:
		case 111:
		case 113:
		case 114:
		case 115:
		case 117:
		case 118:
		case 119:
		case 121:
		case 122:
		case 123:
		case 125:
		case 126:
		case 127:
			hotfolderName = 'CMYKOV_White'; // hotfolder CMYKOW_White
			break;
	}
	return hotfolderName;
}

alert(getHotFolder());
