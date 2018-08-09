/* ---------------------------------------------------
    ARRAY
----------------------------------------------------- */

/*======================== Array Prototype =========================*/
Array.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
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
