/**
 * --------------------------------------------------------------------------
 * DateJS Utils - Uma melhoria nas funções Date do Javascript
 *
 * @author Copyright 2018 RaphaelRDSoares <raphael@rdsoares.com>
 * @license https://en.wikipedia.org/wiki/MIT_License
 * @see https://github.com/raphaelrdsoares/utils
 * @version 0.1.0
 * --------------------------------------------------------------------------
 */

/* --------------------------------------------------------------------------
   Funções acessórias
-------------------------------------------------------------------------- */
//#region

/**
 * Retorna uma String com o número informado e a quantidade desejada de zeros a esquerda.
 * Caso o size seja menor ou igual ao Number, retorna o próprio Number inalterado.
 *
 * Ex: fillWithZero(27, 5) => "00027"; fillWithZero(1, 3) => "001";
 * fillWithZero(7244, 3) => "7244"; fillWithZero(36, 2) => "36"
 *
 * @param {Number} Number número qualquer, Ex: 8
 * @param {Number} size tamanho final da String, Ex: 3
 * @returns {String}  resultado final, Ex: "008"
 */
function fillWithZero(Number, size) {
	var s = Number + "";
	while (s.length < size) s = "0" + s;
	return s;
}

if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, Number) {
			return typeof args[Number] != "undefined" ? args[Number] : match;
		});
	};
}

//#endregion

/* --------------------------------------------------------------------------
    VALIDAÇÕES
-------------------------------------------------------------------------- */
//#region

/**
 * Verifica se a data informada é válida
 *
 * @param {String} dateString no formato "DD/MM/YYYY" ou "DD/MM/YY"
 * @returns {boolean}
 */
Date.isValidDateString = function(dateString) {
	// Checa o padrão
	if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) && !/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateString)) return false;

	// Converte as partes para inteiro
	var parts = dateString.split("/");
	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[2], 10);

	// Se o ano estiver abreviado, converte para o ano completo
	if (year < 70) year = year + 2000;
	else if (year < 100) year = year + 1900;

	// Checa a validade do ano e do mês
	if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

	var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Ajuste do ano bissexto
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;

	// Checa a validade do dia
	return day > 0 && day <= monthLength[month - 1];
};

/**
 * Verifica se a hora informada é válida
 *
 * @param {String} timeString no formato "hh:mm" ou "hh:mm:ss"
 * @returns {boolean}
 */
Date.isValidTimeString = function(timeString) {
	// Checa o padrão do formato
	if (!/^\d{1,2}:\d{1,2}:\d{1,2}$/.test(timeString) && !/^\d{1,2}:\d{1,2}$/.test(timeString)) return false;

	// Converte as partes para inteiro
	var parts = timeString.split(":");
	var hour = parseInt(parts[0], 10);
	var minutes = parseInt(parts[1], 10);
	var seconds = parts[2] ? parseInt(parts[2], 10) : null;

	// Checa a validade das horas
	if (hour < 0 || hour > 23) return false;

	// Checa a validade dos minutos
	if (minutes < 0 || minutes > 59) return false;

	// Checa a validade dos segundos (se houver)
	if (seconds && (seconds < 0 || seconds > 59)) return false;

	return true;
};

/**
 * Verifica se a data/hora informada é válida
 *
 * @param {String} datetimeString no formato "DD/MM/YYYY hh:mm:ss". O ano pode ser com 4 ou 2 dígitos. A hora pode ou não ter segundos
 * @returns {boolean}
 */
Date.isValidDatetime = function(datetimeString) {
	// Separa a data da hora
	var parts = datetimeString.split(" ");
	var date = parts[0];
	var time = parts[1];

	// Valida a data
	const isDateValid = Date.isValidDateString(date);

	// Valida a hora
	const isTimeValid = Date.isValidTimeString(time);

	return isDateValid && isTimeValid;
};

/**
 * Verifica se a data atual é posterior a data informada
 *
 * @param {Date} dateToCompare data a ser comparada
 */
Date.prototype.isAfter = function(dataToCompare) {
	return this.getTime() > dataToCompare.getTime();
};

/**
 * Verifica se a data atual é anterior a data informada
 *
 * @param {Date} dateToCompare data a ser comparada
 */
Date.prototype.isBefore = function(dataToCompare) {
	return this.getTime() < dataToCompare.getTime();
};

/**
 * Verifica se a data atual é igual a data informada.
 * Não leva em consideração as horas, minutos e segundos.
 *
 * @param {Date} dateToCompare data a ser comparada
 */
Date.prototype.equalsDate = function(dataToCompare) {
	return this.clearTime().getTime() === dataToCompare.clearTime().getTime();
};

/**
 * Verifica se a data e horas atual é igual a data e hora informada
 *
 * @param {Date} dateToCompare data a ser comparada
 */
Date.prototype.equalsDatetime = function(dataToCompare) {
	return this.getTime() === dataToCompare.getTime();
};

/**
 * Verifica se a instância está entre (intervalo fechado) duas datas (considerando data/hora)
 *
 * @param {Date}     Start data início [Required]
 * @param {Date}     End data fim [Required]
 * @return {Boolean}
 */
Date.prototype.isBetweenDatetime = function(start, end) {
	return this.getTime() >= start.getTime() && this.getTime() <= end.getTime();
};

/**
 * Verifica se a instância está entre (intervalo fechado) duas datas (considera apenas data; campos de hora são ignorados)
 *
 * @param {Date}     Start data início (apenas data) [Required]
 * @param {Date}     End data fim (apenas data) [Required]
 * @return {Boolean}
 */
Date.prototype.isBetweenDate = function(start, end) {
	return (
		this.clearTime().getTime() >= start.clearTime().getTime() &&
		this.clearTime().getTime() <= end.clearTime().getTime()
	);
};

/**
 * Verifica se o ano informado é um ano válido: entre 1900 e 3000
 *
 * @param {Number} year Ano para ser validado
 * @return {Boolean}
 */
Date.isValidYear = function(year) {
	if (typeof year === "Number" && year >= 1900 && year < 3000) return true;
	return false;
};

/**
 * Verifica se o mês informado é um mês válido: entre 1 e 12
 *
 * @param {Number} month Mês para ser validado
 * @return {Boolean}
 */
Date.isValidMonth = function(month) {
	if (typeof month === "Number" && month > 0 && month < 13) return true;
	return false;
};

/**
 * Verifica se o dia é um dia válido no mês/ano informado: entre 1 e 28,29,30,31 (dependendo do mês/ano)
 * Caso o ano ou o mês sejam inválidos, retorna false
 *
 * @param {Number} year Entre 1900 e 3000
 * @param {Number} month Entre 1 e 12
 * @param {Number} day Entre 1 e [28,29,30,31] (depende do mês/ano)
 * @return {Boolean}
 */
Date.isValidDay = function(year, month, day) {
	if (!Date.isValidYear() || !Data.isValidMonth()) return false;
	var daysInMonth = Date.daysInMonth(year, month);
	if (typeof day === "Number" && day > 1 && day <= daysInMonth) return true;
	return false;
};

/**
 * Verifica se o ano é bissexto.
 *
 * @param {Number} year Ano a ser verificado.
 * @returns {Boolean} true caso o ano seja bissexto, falso caso contrário.
 */
Date.isLeapYear = function(year) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Verifica se o ano é bissexto.
 *
 * @param {Number} year Ano a ser verificado.
 * @returns {Boolean} true caso o ano seja bissexto, falso caso contrário.
 */
Date.prototype.isLeapYear = function() {
	return this.isLeapYear(this.getFullYear());
};

//#endregion

/* --------------------------------------------------------------------------
    CONVERSÕES
-------------------------------------------------------------------------- */
//#region

/**
 * Retorna um novo objeto Date a partir de uma string informada e de um formato definido.
 * Formato aceito: DD -> Dia; MM -> Mês; YYYY -> Ano.
 * Caso não seja definido um "format", o padrão usado será o "DD/MM/YYYY"
 * Obs: Aceita apenas conversão para Date. Caso queira converter data/hora @see fromStringDatetime();
 *
 * @param {String} date data do tipo String [Required]
 * @param {String} format formato da data DD/MM/YYYY (o separador '/' é irrelevante e pode ser trocado por qualquer outro, Ex: "DD.MM#YYYY")
 * @returns {Date}
 */
Date.fromStringDate = function(date, format = "DD/MM/YYYY") {
	return Date.fromStringDatetime(date, format);
};

/**
 * Retorna um novo objeto Date a partir de uma string informada e de um formato definido.
 * Formato aceito: DD -> Dia; MM -> Mês; YYYY -> Ano; hh -> hora; mm -> minuto; ss -> segundo.
 *
 * Caso não seja definido um "format", o padrão usado será o "DD/MM/YYYY hh:mm:ss"
 *
 * Caso algum campo do horario não seja informado, será considerado valor 0.
 * @example
 * Date.fromStringDatetime("2019-05-10 10#15*30", "YYYY-MM-DD hh#mm*ss") => Fri May 10 2019 10:15:30 GMT-0300 (Horário Padrão de Brasília)
 * Date.fromStringDatetime("2019-05-10 10#15", "YYYY-MM-DD hh#mm*ss") => Fri May 10 2019 10:15:00 GMT-0300 (Horário Padrão de Brasília)
 * Date.fromStringDatetime("2019-05-10 10", "YYYY-MM-DD hh#mm*ss") => Fri May 10 2019 10:00:00 GMT-0300 (Horário Padrão de Brasília)
 * Date.fromStringDatetime("2019-05-10", "YYYY-MM-DD hh#mm*ss") => Fri May 10 2019 00:00:00 GMT-0300 (Horário Padrão de Brasília)
 *-
 *
 * Caso algum campo da data não seja informado, será considerado valor da data atual.
 *
 * @param {String} date data do tipo String [Required]
 * @param {String} format formato da data. ex: DD/MM/YYYY hh:mm:ss (o separador '/' e ':' são irrelevantes e podem ser trocado por qualquer outro, Ex: "DD.MM#YYYY hh&mm*ss")
 * @returns {Date}
 */
Date.fromStringDatetime = function(datetimeString, format = "DD/MM/YYYY hh:mm:ss") {
	if (datetimeString == null) return;
	var normalized = datetimeString.replace(/[^a-zA-Z0-9]/g, "-");
	var normalizedFormat = format.replace(/[^a-zA-Z0-9]/g, "-");
	var formatItems = normalizedFormat.split("-");
	var dateItems = normalized.split("-");

	var monthIndex = formatItems.indexOf("MM");
	var dayIndex = formatItems.indexOf("DD");
	var yearIndex = formatItems.indexOf("YYYY");
	var hourIndex = formatItems.indexOf("hh");
	var minutesIndex = formatItems.indexOf("mm");
	var secondsIndex = formatItems.indexOf("ss");

	var today = new Date();

	var year = yearIndex > -1 && yearIndex < dateItems.length ? dateItems[yearIndex] : today.getFullYear();
	var month = monthIndex > -1 && monthIndex < dateItems.length ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
	var day = dayIndex > -1 && dayIndex < dateItems.length ? dateItems[dayIndex] : today.getDate();

	var hour = hourIndex > -1 && hourIndex < dateItems.length ? dateItems[hourIndex] : 0;
	var minute = minutesIndex > -1 && minutesIndex < dateItems.length ? dateItems[minutesIndex] : 0;
	var second = secondsIndex > -1 && secondsIndex < dateItems.length ? dateItems[secondsIndex] : 0;

	return new Date(year, month, day, hour, minute, second);
};

Date.fromStringSQLDatetime = function(datetimeString) {
	return Date.fromStringDatetime(datetimeString, "YYYY-MM-DD hh:mm:ss");
};

/**
 * Retorna uma String no padrão DD/MM/YYYY
 *
 * @param {boolean} useFullYear Caso true, o ano é retornado com 4 dígitos. Caso false, o ano vem com 2 dígitos. Default: true
 * @param {String} separator Separador entre as datas. Default: '/'
 * @param {boolean} monthFirst Caso true, retorna no padrão MM/DD/YYYY. Default: false
 * @returns {String}
 */
Date.prototype.toStringDate = function(useFullYear = true, separator = "/", monthFirst = false) {
	const day = fillWithZero(this.getDate(), 2);
	const month = fillWithZero(this.getMonth() + 1, 2);
	const year = useFullYear ? this.getFullYear() : String(this.getFullYear()).substr(2, 4);

	if (monthFirst) return "{1}{3}{0}{3}{2}".format(day, month, year, separator);
	return "{0}{3}{1}{3}{2}".format(day, month, year, separator);
};

/**
 * Retorna uma String no padrão DD/MM/YYYY
 *
 * @param {Date} dateObj Objeto tipo Date para ser convertido. [Default=data_atual]
 * @param {boolean} useFullYear Caso true, o ano é retornado com 4 dígitos. Caso false, o ano vem com 2 dígitos. Default: true
 * @param {String} separator Separador entre as datas. Default: '/'
 * @param {boolean} monthFirst Caso true, retorna no padrão MM/DD/YYYY. Default: false
 * @returns {String}
 */
Date.toStringDate = function(dateObj = new Date(), useFullYear = true, separator = "/", monthFirst = false) {
	const day = fillWithZero(dateObj.getDate(), 2);
	const month = fillWithZero(dateObj.getMonth() + 1, 2);
	const year = useFullYear ? dateObj.getFullYear() : String(dateObj.getFullYear()).substr(2, 4);

	if (monthFirst) return "{1}{3}{0}{3}{2}".format(day, month, year, separator);
	return "{0}{3}{1}{3}{2}".format(day, month, year, separator);
};

/**
 * Retorna uma String no padrão hh:mm:ss
 *
 * @param {boolean} withSeconds Caso false, retorna a hora sem os segundos. Default: true
 * @param {String} separator Separador entre os tempos. Default: ":"
 * @returns {String}
 */
Date.prototype.toStringTime = function(withSeconds = true, separator = ":") {
	const hour = fillWithZero(this.getHours(), 2);
	const minutes = fillWithZero(this.getMinutes(), 2);
	const seconds = fillWithZero(this.getSeconds(), 2);

	if (withSeconds) return "{0}{3}{1}{3}{2}".format(hour, minutes, seconds, separator);
	return "{0}{2}{1}".format(hour, minutes, separator);
};

/**
 * Retorna uma String no padrão DD/MM/YYYY hh:mm:ss
 *
 * @param {boolean} useFullYear Caso true, o ano é retornado com 4 dígitos. Caso false, o ano vem com 2 dígitos. Default: true
 * @param {boolean} withSeconds Caso false, retorna a hora sem os segundos. Default: true
 * @param {String} dateSeparator Separador entre as datas. Default: '/'
 * @param {String} timeSeparator Separador entre os tempos. Default: ":"
 * @param {boolean} monthFirst Caso true, retorna no padrão MM/DD/YYYY. Default: false
 * @returns {String}
 */
Date.prototype.toStringDatetime = function(
	useFullYear = true,
	withSeconds = true,
	dateSeparator = "/",
	timeSeparator = ":",
	monthFirst = false
) {
	const date = this.toStringDate(useFullYear, dateSeparator, monthFirst);
	const time = this.toStringTime(withSeconds, timeSeparator);
	return "{0} {1}".format(date, time);
};

/**
 * Retorna uma String no padrão DD/MM/YYYY hh:mm:ss de uma data qualquer.
 * Caso não seja informado nenhuma data, será considerada a data atual
 *
 * @param {Date} dateObj Objeto tipo Date para ser convertido. [Default=data_atual]
 * @param {boolean} useFullYear Caso true, o ano é retornado com 4 dígitos. Caso false, o ano vem com 2 dígitos. [Default=true]
 * @param {boolean} withSeconds Caso false, retorna a hora sem os segundos. [Default=true]
 * @param {String} dateSeparator Separador entre as datas. [Default="/"]
 * @param {String} timeSeparator Separador entre os tempos. [Default=":"]
 * @param {boolean} monthFirst Caso true, retorna no padrão MM/DD/YYYY. [Default=false]
 * @returns {String}
 */
Date.toStringDatetime = function(
	dateObj = new Date(),
	useFullYear = true,
	withSeconds = true,
	dateSeparator = "/",
	timeSeparator = ":",
	monthFirst = false
) {
	const date = dateObj.toStringDate(useFullYear, dateSeparator, monthFirst);
	const time = dateObj.toStringTime(withSeconds, timeSeparator);
	return "{0} {1}".format(date, time);
};

/**
 * Retona uma string com a data no formato SQL
 * Obs: mês de 1 a 12
 *
 * @returns {String} data no formato {YYYY-MM-DD hh:mm:ss}
 */
Date.prototype.toStringSQLDatetime = function() {
	return "{0}-{1}-{2} {3}:{4}:{5}".format(
		this.getFullYear(),
		fillWithZero(this.getMonth() + 1, 2),
		fillWithZero(this.getDate(), 2),
		fillWithZero(this.getHours(), 2),
		fillWithZero(this.getMinutes(), 2),
		fillWithZero(this.getSeconds(), 2)
	);
};

/**
 * Retona uma string com a data no formato SQL
 * Obs: mês de 1 a 12
 *
 * @param {Date} dateObj data a ser convertida
 * @returns {String} data no formato {YYYY-MM-DD hh:mm:ss}
 */
Date.toStringSQLDatetime = function(dateObj = new Date()) {
	return "{0}-{1}-{2} {3}:{4}:{5}".format(
		dateObj.getFullYear(),
		fillWithZero(dateObj.getMonth() + 1, 2),
		fillWithZero(dateObj.getDate(), 2),
		fillWithZero(dateObj.getHours(), 2),
		fillWithZero(dateObj.getMinutes(), 2),
		fillWithZero(dateObj.getSeconds(), 2)
	);
};

//#endregion

/* --------------------------------------------------------------------------
    OPERAÇÕES
-------------------------------------------------------------------------- */
//#region

/**
 * Clona a data
 *
 * @returns {Date} Novo objeto do tipo Date
 */
Date.prototype.clone = function() {
	return new Date(this);
};

/**
 * Retorna um Date adicionando o valor informado ao número de anos da data do objeto.
 *
 * @param {int} value - número de anos. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addYears = function(value) {
	var newDate = new Date(this.getTime());
	return new Date(newDate.setFullYear(newDate.getFullYear() + value));
};

/**
 * Retorna um Date adicionando o valor informado ao número de meses da data do objeto.
 *
 * @param {int} value - número de meses. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addMonths = function(value) {
	var newDate = this.clone();
	newDate.setMonth(newDate.getMonth() + value);
	return newDate;
};

/**
 * Retorna um Date adicionando o valor informado ao número de semanas do objeto.
 *
 * @param {int} value - número de semanas. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addWeeks = function(value) {
	var date = new Date(this.getTime());
	return date.addDays(value * 7);
};

/**
 * Retorna um Date adicionando o valor informado ao número de dias da data do objeto.
 *
 * @param {int} value - número de dias. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addDays = function(value) {
	var date = new Date(this.getTime());
	return new Date(date.setDate(date.getDate() + value * 1));
};

/**
 * Retorna um Date adicionando o valor informado ao número de horas da data do objeto.
 *
 * @param {int} value - número de horas. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addHours = function(value) {
	return new Date(this.getTime() + value * 60 * 60 * 1000);
};

/**
 * Retorna um Date adicionando o valor informado ao número de minutos da data do objeto.
 *
 * @param {int} value - número de minutos. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addMinutes = function(value) {
	return new Date(this.getTime() + value * 60 * 1000);
};

/**
 * Retorna um Date adicionando o valor informado ao número de segundos da data do objeto.
 *
 * @param {int} value - número de segundos. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addSeconds = function(value) {
	return new Date(this.getTime() + value * 1000);
};

/**
 * Retorna um Date adicionando o valor informado ao número de milisegundos da data do objeto.
 *
 * @param {int} value - número de milisegundos. Aceita valores positivo ou negativo.
 * @returns {Date} campos data/hora preenchidos.
 */
Date.prototype.addMiliseconds = function(value) {
	return new Date(this.getTime() + value);
};

//#endregion

/* --------------------------------------------------------------------------
    UTILITÁRIOS
-------------------------------------------------------------------------- */
//#region

/**
 * Retorna da idade da instância em anos em uma determinada data
 *
 * @param {Date} onDate data de referência para calcular a idade
 * @returns {int} idade em anos || null caso [onDate] seja anterior a instância
 */
Date.prototype.findAge = function(onDate = new Date()) {
	if (onDate.isBefore(this)) return null;
	var age = onDate.getFullYear() - this.getFullYear();
	var m = onDate.getMonth() - this.getMonth();
	if (m < 0 || (m === 0 && onDate.getDate() < this.getDate())) {
		age--;
	}

	return age;
};

/**
 * Retorna o número da semana da data atual.
 * Semana começa no domingo e finaliza no sábado
 *
 * @returns {Number} de 1 a 53
 */
Date.prototype.getWeekNumber = function() {
	var onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil(((this - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};

/**
 * Retorna o número da semana da data atual.
 * Semana começa no domingo e finaliza no sábado.
 * Caso o mês informado seja diferente do permitido, retorna null
 * Caso dia informado esteja fora do range de dias do mês/ano em questão, retorna null
 *
 * @param {Number} year Ano com 4 dígitos;
 * @param {Number} month Mês (de 1 a 12)
 * @param {Number} day Dia do mês;
 * @returns {Number} de 1 a 53
 */
Date.getWeekNumber = function(year, month, day) {
	if (month < 1 || month > 12) return null;

	var maxDaysInMonth = Date.daysInMonth(year, month);
	if (day < 0 || day > maxDaysInMonth) return null;

	new Date(year, month - 1, day).getWeekNumber();
};

/**
 * Retorna um Date apenas com o dia, mês e ano preenchidos, o resto estará zerado
 *
 * @param {Date} [dateToConvert=new Date()] data que será convertida. Caso não seja informado, será considerada a data atual
 * @returns {Date} apenas campos data preenchidos
 */
Date.toDate = function(dateToConvert) {
	if (!dateToConvert) dateToConvert = new Date();

	if (dateToConvert instanceof Date)
		return new Date(dateToConvert.getFullYear(), dateToConvert.getMonth(), dateToConvert.getDate());

	return null;
};

/**
 * Retorna a instância atual apenas com o dia, mês e ano preenchidos do objeto, o resto estará zerado
 *
 * @returns {Date}  apenas campos data preenchidos
 */
Date.prototype.toDate = function() {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

/**
 * Retorna a instância atual apenas com o dia, mês e ano preenchidos do objeto, o resto estará zerado
 *
 * @returns {Date}  apenas campos data preenchidos
 */
Date.prototype.clearTime = function() {
	return this.toDate();
};

/**
 * Retorna um Date apenas com o dia, mês e ano preenchidos com a data corrente, o resto estará zerado
 *
 * @returns {Date} apenas campos data preenchidos
 */
Date.today = function() {
	return new Date().clearTime();
};

/**
 * Retorna a instância atual apenas com o dia, mês e ano preenchidos com a data corrente, o resto estará zerado
 *
 * @returns {Date}  apenas campos data preenchidos
 */
Date.prototype.today = function() {
	return Date.today();
};

/**
 * Retorna um Date com exatas 24 horas a mais que a data corrente
 *
 * @returns {Date} data/hora preenchidos
 */
Date.tomorrow = function() {
	return new Date().addDays(1);
};

/**
 * Retorna a instância atual com exatas 24 horas a mais que data do objeto
 *
 * @returns {Date} data/hora preenchidos
 */
Date.prototype.tomorrow = function() {
	return this.addDays(1);
};

/**
 * Retorna apenas o dia, mês, ano do dia posterior ao dia corrente
 *
 * @returns {Date} apenas campos data preenchidos
 */
Date.tomorrowDate = function() {
	return new Date().addDays(1).clearTime();
};

/**
 * Retorna apenas o dia, mês, ano do dia posterior a data do objeto
 *
 * @returns {Date} apenas campos data preenchidos
 */
Date.prototype.tomorrowDate = function() {
	return this.addDays(1).clearTime();
};

/**
 * Retorna um Date com exatas 24 horas a mais que a data corrente
 *
 * @returns {Date} data/hora preenchidos
 */
Date.yesterday = function() {
	return new Date().addDays(-1);
};

/**
 * Retorna um Date com exatas 24 horas a mais que data da instância atual
 *
 * @returns {Date} data/hora preenchidos
 */
Date.prototype.yesterday = function() {
	return this.addDays(-1);
};

/**
 * Retorna apenas o dia, mês, ano do dia anterior ao dia corrente
 *
 * @returns {Date} apenas campos data preenchidos
 */
Date.yesterdayDate = function() {
	return new Date().addDays(-1).clearTime();
};

/**
 * Retorna apenas o dia, mês, ano do dia anterior a data da instância atual
 *
 * @returns {Date} apenas campos data preenchidos
 */
Date.prototype.yesterdayDate = function() {
	return this.addDays(-1).clearTime();
};

/**
 * Retorna o ano da data atual
 *
 * @returns {Number} Ano com 4 dígitos
 */
Date.year = function() {
	return new Date().getFullYear();
};

/**
 * Retorna o mês da data atual
 *
 * @returns {Number} Mês (de 1 a 12)
 */
Date.month = function() {
	return new Date().getMonth() + 1;
};

/**
 * Retorna o dia do mês da data atual
 *
 * @returns {Number} Dia (de 1 a 31)
 */
Date.day = function() {
	return new Date().getDate();
};

/**
 * Retorna o primeiro dia do mês da data do objeto
 *
 * @returns {Date} data preenchida e horario zerada (ex: 01/MM/YYYY 00:00:00)
 */
Date.prototype.firstDayOfMonth = function() {
	return new Date(this.getFullYear(), this.getMonth(), 1);
};

/**
 * Retorna o primeiro dia de um determinado mes/ano
 *
 * @param {Number} year ex: 2018
 * @param {Number} month entre 1 e 12
 * @returns {Date} data preenchida e horario zerada (ex: 01/MM/YYYY 00:00:00)
 */
Date.firstDayOfMonth = function(year, month) {
	return new Date(year, month - 1, 1);
};

/**
 * Retorna o último dia do mês da data do objeto
 *
 * @returns {Date} data preenchida e horario zerado (ex: 31/MM/YYYY 00:00:00)
 */
Date.prototype.lastDayOfMonth = function() {
	return new Date(this.getFullYear(), this.getMonth() + 1, 0);
};

/**
 * Retorna o último dia do mês da data do objeto
 *
 * @param {Number} year ex: 2018
 * @param {Number} month entre 1 e 12
 * @returns {Date} data preenchida e horario zerado (ex: 31/MM/YYYY 00:00:00)
 */
Date.lastDayOfMonth = function(year, month) {
	return new Date(year, month, 0);
};

/**
 * Retorna o último segundo de dia
 *
 * @returns {Date} Data com horário => 23:59:59
 */
Date.prototype.lastSecondOfDay = function() {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate(), 23, 59, 59);
};

/**
 * Retorna o último segundo de dia
 *
 * @param {Number} year ex: 2018
 * @param {Number} month entre 1 e 12
 * @param {Number} date entre 1 e 31
 * @returns {Date} Data com horário => 23:59:59
 */
Date.lastSecondOfDay = function(year, month, date) {
	return new Date(year, month - 1, date).lastSecondOfDay();
};

/**
 * Retorna a quantidade de dias de um determinado mês/ano
 *
 * @param {Number} year ex: 2018  [Default=currentYear]
 * @param {Number} month entre 1 e 12 [Default=currentMonth]
 * @returns {Number} quantidade de dias no mês
 */
Date.daysInMonth = function(year = null, month = null) {
	if (isNullOrEmptyOrUndefined(year)) year = new Date().getFullYear();
	if (isNullOrEmptyOrUndefined(month)) month = new Date().getMonth() + 1;
	return new Date(year, month, 0).getDate();
};

/**
 * Retorna a quantidade de dias do mês/ano da data do objeto
 *
 * @returns {Number} quantidade de dias no mês
 */
Date.prototype.daysInMonth = function() {
	return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
};

/**
 * Retorna a quantidade de horas de um determinado mês/ano
 *
 * @param {Number} year ex: 2018 [Default=currentYear]
 * @param {Number} month entre 1 e 12 [Default=currentMonth]
 * @returns {Number} quantidade de horas no mês
 */
Date.hoursInMonth = function(year = null, month = null) {
	if (isNullOrEmptyOrUndefined(year)) year = new Date().getFullYear();
	if (isNullOrEmptyOrUndefined(month)) month = new Date().getMonth() + 1;
	return new Date(year, month, 0).getDate() * 24;
};

/**
 * Retorna a quantidade de horas do mês/ano da data do objeto
 *
 * @returns {Number} quantidade de horas no mês
 */
Date.prototype.hoursInMonth = function() {
	return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate() * 24;
};

/**
 * Retorna a quantidade de minutos de um determinado mês/ano
 *
 * @param {Number} year ex: 2018 [Default=currentYear]
 * @param {Number} month entre 1 e 12 [Default=currentMonth]
 * @returns {Number} quantidade de minutos no mês
 */
Date.minutesInMonth = function(year = null, month = null) {
	if (isNullOrEmptyOrUndefined(year)) year = new Date().getFullYear();
	if (isNullOrEmptyOrUndefined(month)) month = new Date().getMonth() + 1;
	return new Date(year, month, 0).getDate() * 24 * 60;
};

/**
 * Retorna a quantidade de minutos do mês/ano da data do objeto
 *
 * @returns {Number} quantidade de minutos no mês
 */
Date.prototype.minutesInMonth = function() {
	return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate() * 24 * 60;
};

/**
 * Retorna o número do dia no ano.
 *
 * @example
 * new Date(2019,2,1).getDayNumberInYear() => 32
 * new Date(2019,3,17).getDayNumberInYear() => 76
 * new Date(2019,9,20).getDayNumberInYear() => 263
 *
 * @returns {Number} de 1 a 366.
 */
Date.prototype.getDayNumberInYear = function() {
	return (
		(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()) - Date.UTC(this.getFullYear(), 0, 0)) /
		24 /
		60 /
		60 /
		1000
	);
};

/**
 * Retorna o número do dia no ano.
 *
 * @example
 * Date.getDayNumberInYear(2019,2,1) => 32
 * Date.getDayNumberInYear(2019,3,17) => 76
 * Date.getDayNumberInYear(2019,9,20) => 263
 *
 * @returns {Number} de 1 a 366.
 */
Date.getDayNumberInYear = function(year, month, day) {
	return (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;
};


/**
 * Retorna uma data aleatória entre duas datas.
 *
 * @param {Date} from data de início [Default=new Date(0)]
 * @param {Date} to data de fim [Default=new Date()]
 * @returns {Date}
 */
Date.random = function(from = new Date(0), to = new Date()) {
	var min = Math.ceil(from.getTime());
	var max = Math.floor(to.getTime());
	return new Date(Math.floor(Math.random() * (max - min + 1)) + min);
};
//#endregion
