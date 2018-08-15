/* ---------------------------------------------------
    ARRAY
----------------------------------------------------- */

/*======================== Array Prototype =========================*/
Array.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
};


/* ---------------------------------------------------
    VALIDATIONS
----------------------------------------------------- */
/**
 * Verifica se o email é válido 
 * 
 * @param {String} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Verifica se a data informada é válida
 * 
 * @param {String} dateString no formato "DD/MM/YYYY" ou "DD/MM/YY"
 * @returns {boolean}
 */
function isValidDate(dateString) {
    // Checa o padrão
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) && !/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateString))
        return false;

    // Converte as partes para inteiro
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Se o ano estiver abreviado, converte para o ano completo
    if(year < 50)
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


/* ---------------------------------------------------
    UTILITIES 
----------------------------------------------------- */

/**
 * Gera uma chave randomicamente com o tamanho determinado no parâmetro.
 * @param {string} keyLength 
 */
export function generateKey(keyLength = 10) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < keyLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Formata a string informada para o formato 000.000.000-00
 * @param {string} strCpfWithoutMask 
 */
export function formatCPF(strCpfWithoutMask) {
    return strCpfWithoutMask.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
}

/**
 * Formata a string informada para o formato 00.000.000/0000-00
 * @param {string} strCnpjWithourMask 
 */
export function formatCNPJ(str) {
    return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5")
}

/**
 * Remove a formatação de um texto, retornando apenas valores numericos da string.
 * @param {string} strText 
 */
export function removeFormat(strText) {
    return strText.replace(/(\.|\/|-|_)/g, "");
}

/**
 * Retorna um booleano de acordo com o valor passado no parâmetro
 * 
 * @param {String} object 
 */
export function getBooleanValue(object) {
    if (object === "true" || object === "True" || object === "1" || object === 1)
        return true;
    return false;
}

/**
 * Busca uma propriedade qualquer de um objeto qualquer (independente se estiver dentro de outras)
 * @param {*} obj 
 * @param {*} prop 
 */
export function fetchFromObject(obj, prop) {

    if (typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if (_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}

/**
 * Clona um objeto e suas dependências considereando referências cíclicas quando houver
 * @param {*} obj 
 * @param {*} hash 
 */
export function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) { // tipos primitivos
        return obj;
    }

    if (hash.has(obj)) { // referências cíclicas
        return hash.get(obj);
    }

    const result = obj instanceof Date ? 
        new Date(obj)
        : obj instanceof RegExp ? 
            new RegExp(obj.source, obj.flags)
            : obj.constructor ? 
                new obj.constructor()
                : Object.create(null);

    hash.set(obj, result);
    
    if (obj instanceof Map) {
        Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)));
    }

    return Object.assign(result, ...Object.keys(obj)
                 .map(key => ({
                      [key]: deepClone(obj[key], hash) 
                    })
                )
            );
}
