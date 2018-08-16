/**
 * Utils JS - Uma biblioteca de funções JS utilitárias
 *
 * @author Copyright 2018 RaphaelRDSoares <raphael@rdsoares.com>
 * @license https://en.wikipedia.org/wiki/MIT_License
 * @see https://github.com/raphaelrdsoares/utils
 * @version 0.1.0
 * ---------------------------------------------------
 * Regras:
 *
 *     Código - em EN
 *     Comentários - em PT-BR;
 * 
 *     Colocar comentário em TODOS os métodos seguindo
 *     o padrão abaixo
 *     /**
 *      * [Breve descrição do que o método faz]
 *      * 
 *      * @param {[Tipo do objeto ou * p/ qualquer tipo]} nome_do_parâmetro - breve descrição [opcional]
 *      * @param {[Tipo do objeto ou * p/ qualquer tipo]} nome_do_parâmetro - breve descrição [opcional]
 *      * @returns {[Tipo do objeto ou * p/ qualquer tipo]} - breve descrição [opcional]
 *      * /
 * 
 *      Nome de método com retorno booleano deve iniciar com 'is...';
 *      Ex: "isValidEmail(..)"
 */

/* ---------------------------------------------------
    PROTOTYPE'S
----------------------------------------------------- */

/*================= Array Prototype ==================*/
Array.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
};

/*================= Object Prototype =================*/
Object.prototype.clone = function() {
    return JSON.parse(JSON.stringify(this));
};

/*================= String Prototype =================*/
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match ;
        });
    };
}


/* ---------------------------------------------------
    VALIDAÇÕES
----------------------------------------------------- */
/**
 * Verifica se o email informado é válido 
 * 
 * @param {String} email 
 * @returns {boolean}
 */
function isValidEmail(email) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-]{3,})+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Verifica se o CPF informado é válido
 * 
 * @param {String} cpf com ou sem formatação
 * @returns {boolean}
 */
function isValidCPF(cpf) {
    cpf = removeFormat(cpf);
    var numbers, digits, sum, i, result, equalDigits;
    equalDigits = 1;
    if (cpf.length < 11)
        return false;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            equalDigits = 0;
            break;
        }
    if (!equalDigits) {
        numbers = cpf.substring(0, 9);
        digits = cpf.substring(9);
        sum = 0;
        for (i = 10; i > 1; i--)
            sum += numbers.charAt(10 - i) * i;
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result != digits.charAt(0))
            return false;
        numbers = cpf.substring(0, 10);
        sum = 0;
        for (i = 11; i > 1; i--)
            sum += numbers.charAt(11 - i) * i;
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result != digits.charAt(1))
            return false;
        return true;
    }
    else
        return false;
}



/* ---------------------------------------------------
    CONVERSÕES
----------------------------------------------------- */


/**
 * Converte uma cor em Hexadecimal para RGB
 * 
 * @param {String} hex no formato #000000
 * @returns {String} no formato "255, 255, 255" 
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
};

/**
 * Converte uma String para Date Javascript
 * 
 * @param {String} dateString no formato "DD/MM/YYYY" ou "DD/MM/YY"
 * @returns {Date} 
 */
function convertToDate(dateString) {
    // Verifica se a data é válida
    if (! isValidDate(dateString))
        return null;

    // Converte as partes para inteiro
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);
    
    // Se o ano estiver abreviado, converte para o ano completo
    if (year < 50)
        year = year + 2000;
    else if (year < 100)
        year = year + 1900;

    return new Date(year, (month-1), day);
}

/* ---------------------------------------------------
    UTILITÁRIOS
----------------------------------------------------- */

/**
 * Retorna uma String com o número informado e a quantidade desejada de zeros a esquerda.
 * Caso o size seja menor ou igual ao number, retorna o próprio number inalterado. 
 * 
 * Ex: fillLeftZero(27, 5) => "00027"; fillLeftZero(1, 3) => "001"; 
 * fillLeftZero(7244, 3) => "7244"; fillLeftZero(36, 2) => "36"
 * 
 * @param {Number} number número qualquer, Ex: 8
 * @param {Number} size tamanho final da String, Ex: 3
 * @returns {String}  resultado final, Ex: "008"
 */
function fillWithZero(number, size) {
    var s = number + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * Retorna um inteiro gerado aleatoriamente entre o min (incluso) e max (incluso)
 * 
 * @param {int} min 
 * @param {int} max 
 * @returns {int}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gera uma chave aleatória com o tamanho determinado no parâmetro.
 *
 * @param {Number} keyLength tamanho da chave. Default: 10
 * @returns {String} chave gerada
 */
function generateKey(keyLength = 10) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < keyLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Formata a string informada para o formato 000.000.000-00
 * 
 * @param {String} strCpfWithoutMask 
 * @returns {String}
 */
function formatCPF(strCpfWithoutMask) {
    return strCpfWithoutMask.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
}

/**
 * Formata a string informada para o formato 00.000.000/0000-00
 * 
 * @param {string} strCnpjWithourMask 
 * @returns {string}
 */
function formatCNPJ(str) {
    return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5")
}

/**
 * Remove a formatação de um texto. Caracteres retirados => .,/-_)(
 * 
 * @param {String} strText texto a ser limpado 
 * @returns {String}
 */
function removeFormat(strText) {
    return strText.replace(/(\.|\/|-| |[(]|[)]|_)/g, "");
}

/**
 * Retorna um booleano de acordo com o valor informado
 * 
 * @param {String|Number} value 
 * @returns {boolean} true ou false
 */
function getBooleanValue(value) {
    if (value === "true" || value === "True" || value === "1" || value === 1 || value === true)
        return true;
    return false;
}

/**
 * Busca uma propriedade qualquer de um objeto qualquer (independente se estiver dentro de outras)
 * 
 * @param {Object} obj Objeto onde será realizada a busca
 * @param {String} prop nome da propriedade
 */
function fetchFromObject(obj, prop) {

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
 * 
 * @param {*} obj 
 * @param {*} hash 
 */
function deepClone(obj, hash = new WeakMap()) {
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
