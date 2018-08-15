/*!
 * ---------------------------------------------------
 * Date Utils v0.1.0 (https://github.com/raphaelrdsoares/utils)
 * @author RaphaelRDSoares <raphael@rdsoares.com> 
 * http://raphael.rdsoares.com/
 * Copyright 2018 
 * Licensed under MIT
 * ---------------------------------------------------
 */

/**
 * Clona a data
 * 
 * @returns {Date} Novo objeto do tipo Date
 */
Date.prototype.clone = function() {
  return new Date(this);
};

/**
 * Verifica se a data informada é válida
 * 
 * @param {String} dateString no formato "DD/MM/YYYY" ou "DD/MM/YY"
 * @returns {boolean}
 */
Date.isValid = function(dateString) {
    // Checa o padrão
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) && !/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateString))
        return false;

    // Converte as partes para inteiro
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Se o ano estiver abreviado, converte para o ano completo
    if(year < 70)
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

