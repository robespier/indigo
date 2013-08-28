#target Illustrator-13

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
		switch(inkDec) {
			case 60, 4, 8, 16, 32, 36, 40, 48, 56, 24, 20, 28, 12, 44, 52:
				hotfolderName = 'CMYK'; // hotfolder CMYK
					break;
			case 124, 68, 72, 80, 96, 100, 104, 112, 120, 88, 84, 92, 76, 108, 116:
				hotfolderName = 'CMYKW'; // hotfolder CMYKW
					break;				
			case 61, 5, 9, 17, 33, 37, 41, 49, 57, 25, 21, 29, 13, 45, 53, 125, 69, 73, 81, 97, 101, 105, 113, 121, 89, 85, 93, 77, 109, 117, 1, 62, 6, 10, 18, 34, 38, 42, 50, 58, 26, 22, 30, 14, 46, 54, 126, 70, 74, 82, 98, 102, 106, 114, 122, 90, 86, 94, 78, 110, 118, 2, 63, 127, 7, 11, 19, 35, 39, 43, 51, 59, 27, 23, 31, 15, 47, 55, 127, 71, 75, 83, 99, 103 ,107 ,115 ,123, 91, 87, 95, 79, 111, 119, 3:
				hotfolderName = 'CMYKOV_White'; // hotfolder CMYKOW_White
					break;
		}
return hotfolderName;
}

alert(getHotFolder());