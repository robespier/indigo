/**
 * Велосипеды собственной конструкции
 */

/**
 * Округление рационального числа до трёх знаков после запятой
 *
 * @param {number} num 
 * @return {number}
 */
Indigo.round3 = function(num) {
	return Math.round(num * 1000) / 1000;
};

/**
 * Паддинг слева
 *
 * Крадено, чуть подправлено:
 * @see http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
 *
 * @param {string} str Исходная строка
 * @param {string} ch Символ паддинга
 * @param {number} count Длина выходной строки
 * @example
 * Indigo.lpad('right', '-', 10);
 * // returns '-----right'
 * @return {string} 
 */
Indigo.lpad = function(str, ch, count) {
	count -= str.toString().length;
	if ( count > 0 ) {
		return new Array( count + (/\./.test( str ) ? 2 : 1) ).join(ch) + str;
	}
	return str;
};
