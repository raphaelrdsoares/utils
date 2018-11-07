/**
 * ---------------------------------------------------
 * Date Utils - Uma melhoria nas funções Date do Javascript
 *
 * @author Copyright 2018 RaphaelRDSoares <raphael@rdsoares.com>
 * @license https://en.wikipedia.org/wiki/MIT_License
 * @see https://github.com/raphaelrdsoares/utils
 * @version 0.1.0
 * ---------------------------------------------------
 */

/* ---------------------------------------------------
   Funções acessórias
----------------------------------------------------- */
function fillLeftZero(number, size = 2) {
    var s = number + "";
    while (s.length < size) s = "0" + s;
    return s;
}
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}


/* ---------------------------------------------------
    VALIDAÇÕES
----------------------------------------------------- */

/**
 * Verifica se a data informada é válida
 * 
 * @param {String} dateString no formato "DD/MM/YYYY" ou "DD/MM/YY"
 * @returns {boolean}
 */
Date.isValidDate = function (dateString) {
    // Checa o padrão
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) && !/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateString))
        return false;

    // Converte as partes para inteiro
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Se o ano estiver abreviado, converte para o ano completo
    if (year < 70)
        year = year + 2000;
    else if (year < 100)
        year = year + 1900;


    // Checa a validade do ano e do mês
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Ajuste do ano bissexto
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Checa a validade do dia
    return day > 0 && day <= monthLength[month - 1];
};

/**
 * Verifica se a hora informada é válida
 * 
 * @param {String} timeString no formato "hh:mm" ou "hh:mm:ss"
 * @returns {boolean}
 */
Date.isValidTime = function (timeString) {
    // Checa o padrão do formato
    if (!/^\d{1,2}:\d{1,2}:\d{1,2}$/.test(timeString) && !/^\d{1,2}:\d{1,2}$/.test(timeString))
        return false;

    // Converte as partes para inteiro
    var parts = timeString.split(":");
    var hour = parseInt(parts[0], 10);
    var minutes = parseInt(parts[1], 10);
    var seconds = parts[2] ? parseInt(parts[2], 10) : null

    // Checa a validade das horas 
    if (hour < 0 || hour > 23)
        return false;

    // Checa a validade dos minutos
    if (minutes < 0 || minutes > 59)
        return false;

    // Checa a validade dos segundos (se houver)
    if (seconds && (seconds < 0 || seconds > 59))
        return false;

    return true;
};

/**
 * Verifica se a data/hora informada é válida
 * 
 * @param {String} datetimeString no formato "DD/MM/YYYY hh:mm:ss". O ano pode ser com 4 ou 2 dígitos. A hora pode ou não ter segundos
 * @returns {boolean}
 */
Date.isValidDatetime = function (datetimeString) {
    // Separa a data da hora
    var parts = datetimeString.split(" ");
    var date = parts[0];
    var time = parts[1];
    
    // Valida a data
    const isDateValid = Date.isValidDate(date);
    
    // Valida a hora
    const isTimeValid = Date.isValidTime(time);

    return isDateValid && isTimeValid;
}


/* ---------------------------------------------------
    CONVERSÕES
----------------------------------------------------- */

/**
 * Retorna uma String no padrão DD/MM/YYYY
 * 
 * @param {boolean} useFullYear Caso true, o ano é retornado com 4 dígitos. Caso false, o ano vem com 2 dígitos. Default: true
 * @param {String} separator Separador entre as datas. Default: '/'
 * @param {boolean} monthFirst Caso true, retorna no padrão MM/DD/YYYY. Default: false
 * @returns {String}
 */
Date.prototype.toStringDate = function (useFullYear = true, separator = "/", monthFirst = false) {
    const day = fillLeftZero(this.getDate());
    const month = fillLeftZero(this.getMonth() + 1);
    const year = useFullYear ? this.getFullYear() : String(this.getFullYear()).substr(2,4);
    
    if (monthFirst)
        return "{1}{3}{0}{3}{2}".format(day, month, year, separator);
    return "{0}{3}{1}{3}{2}".format(day, month, year, separator);
};

/**
 * Retorna uma String no padrão hh:mm:ss
 * 
 * @param {boolean} withSeconds Caso false, retorna a hora sem os segundos. Default: true
 * @param {String} separator Separador entre os tempos. Default: ":"
 * @returns {String}
 */
Date.prototype.toStringTime = function (withSeconds = true, separator = ":") {
    const hour = fillLeftZero(this.getHours());
    const minutes = fillLeftZero(this.getMinutes());
    const seconds = fillLeftZero(this.getSeconds());
    
    if(withSeconds)
        return "{0}{3}{1}{3}{2}".format(hour, minutes, seconds, separator)
    return "{0}{2}{1}".format(hour, minutes, separator)
}

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
Date.prototype.toStringDatetime = function (useFullYear = true, withSeconds = true, dateSeparator = "/", timeSeparator = ":", monthFirst = false) {
    const date = this.toStringDate(useFullYear, dateSeparator, monthFirst);
    const time = this.toStringTime(withSeconds, timeSeparator);
    return "{0} {1}".format(date, time);
}



/* ---------------------------------------------------
    OPERAÇÕES
----------------------------------------------------- */

/**
 * Clona a data
 * 
 * @returns {Date} Novo objeto do tipo Date
 */
Date.prototype.clone = function () {
    return new Date(this);
};


/* ---------------------------------------------------
    UTILITÁRIOS
----------------------------------------------------- */



/**
 * @todo Retorna um Date apenas com o dia, mês e ano preenchidos, o resto estará zerado
 * 
 * @param {Date} [dateToConvert=new Date()] data que será convertida. Caso não seja informado, será considerada a data atual
 * @returns {Date} apenas campos data preenchidos
 */
Date.toDate = function (dateToConvert) {
    if (!dateToConvert)
        dateToConvert = new Date();
    
    if (dateToConvert instanceof Date)
        return new Date(dateToConvert.getFullYear(), dateToConvert.getMonth(), dateToConvert.getDate());
        
    return null;
}


/**
 * @todo Retorna um Date apenas com o dia, mês e ano preenchidos do objeto, o resto estará zerado
 * 
 * @returns {Date}  apenas campos data preenchidos
 */
Date.prototype.toDate = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate())
};

/**
 * @todo Retorna um Date apenas com o dia, mês e ano preenchidos com a data corrente, o resto estará zerado
 * 
 * @returns {Date} apenas campos data preenchidos
 */
Date.today = function () {
}

/**
 * @todo Retorna um Date apenas com o dia, mês e ano preenchidos com a data corrente, o resto estará zerado
 * 
 * @returns {Date}  apenas campos data preenchidos
 */
Date.prototype.today = function () {
};

/**
 * @todo Retorna um Date com exatas 24 horas a mais que a data corrente
 * 
 * @returns {Date} data/hora preenchidos
 */
Date.tomorrow = function () {
}

/**
 * @todo Retorna um Date com exatas 24 horas a mais que data do objeto
 * 
 * @returns {Date} data/hora preenchidos
 */
Date.prototype.tomorrow = function () {
};

/**
 * @todo Retorna apenas o dia, mês, ano do dia posterior ao dia corrente
 * 
 * @returns {Date} apenas campos data preenchidos
 */
Date.tomorrowDate = function () {
}

/**
 * @todo Retorna apenas o dia, mês, ano do dia posterior a data do objeto
 * 
 * @returns {Date} apenas campos data preenchidos
 */
Date.prototype.tomorrowDate = function () {
};

/**
 * @todo Retorna o primeiro dia do mês da data do objeto
 * 
 * @returns {Date} apenas campos data preenchidos
 */
Date.prototype.firstDayMonth = function () {
};


/**
 * @todo Retorna o último dia do mês da data do objeto
 * 
 * @returns {Date} apenas campos data preenchidos
 */
Date.prototype.LastDayMonth = function () {
};




