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
 *     Nome de método com retorno booleano deve iniciar com 'is...';
 *     Ex: "isValidEmail(..)"
 *
 * @example
 * 
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @since      x.x.x
 * @deprecated x.x.x Use new_function_name() instead.
 * @access     private
 *
 * @class
 * @augments parent
 * @mixes    mixin
 *
 * @alias    realName
 * @memberof namespace
 *
 * @see  https://make.wordpress.org/core/handbook/best-practices/inline-documentation-standards/javascript/#functions
 * @link URL
 * @global
 *
 * @fires   eventName
 * @fires   className#eventName
 * @listens event:eventName
 * @listens className~event:eventName
 *
 * @param {type}   var           Description.
 * @param {type}   [var]         Description of optional variable.
 * @param {type}   [var=default] Description of optional variable with default variable.
 * @param {Object} objectVar     Description.
 * @param {type}   objectVar.key Description of a key in the objectVar parameter.
 *
 * @yield {type} Yielded value description.
 *
 * @return {type} Return value description.
 *

 */

/* ---------------------------------------------------
    PROTOTYPE'S
----------------------------------------------------- */
//#region
/*================= Array Prototype ==================*/
Array.prototype.clone = function() {
	return JSON.parse(JSON.stringify(this));
};
/**
 * Remove o elemento do array pelo index;
 *
 * @param {int} index index do elemento que será removido
 * @returns {boolean} true caso o elemento tenha sido removido. false caso o index não esteja dentro do tamanho do array.
 */
Array.prototype.removeByIndex = function(index) {
	if (index > -1 && index < this.length) {
		this.splice(index, 1);
		return true;
	}
	return false;
};

/**
 * Retorna true caso o array esteja vazio.
 * Retorna false caso o array esteja com pelo menos 1 elemento
 *
 * @returns {boolean}
 */
Array.prototype.isEmpty = function() {
	if (this.length > 0) return false;
	return true;
};

/**
 * Adiciona o elemento ao final do array apenas se a condição informada for true
 *
 * @param {Object} element
 * @param {boolean} condition
 */
Array.prototype.pushIf = function(element, condition) {
	if (condition) {
		this.push(element);
	}
};

/*================= String Prototype =================*/
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
	/**
	 * Formata a string. Primeiro parâmetro começa em 0.
	 *
	 * @example
	 * "{0} é {1}".format("A resposta de tudo", "42") => "A resposta de tudo é 42";
	 */
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != "undefined" ? args[number] : match;
		});
	};
}
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

/**
 * Verifica se a string atual é igual (com ".trim()") a string informada.
 *
 * @param {String} txt string para comparar. [Required]
 * @param {Boolean} ignoreCase ignorar se as letras estão maiúsculas ou minúsculas na comparação. [Default=false]
 * @returns {Boolean} Caso o parametro informado não seja {String} || seja null || seja undefined, retorna false.
 */
String.prototype.equals = function(txt, ignoreCase = false) {
	if (isNullOrEmptyOrUndefined(txt) || typeof txt !== "string") return false;
	return ignoreCase ? this.toLocaleLowerCase().trim() === txt.toLocaleLowerCase().trim() : this.trim() === txt.trim();
};
//#endregion

/* ---------------------------------------------------
    VALIDAÇÕES
----------------------------------------------------- */
//#region
/**
 * Retorna true caso o valor informado seja null, undefined ou esteja vazio.
 *
 * Obs: caso seja informado o valor 0, retornará false, pois 0 é um valor.
 * Obs²: caso seja informado um objeto, mesmo que não possua nenhuma propriedade
 * 	(ex: {}), retornará false, pois um objeto é um valor
 * @param {*} value Objeto com qualquer valor. [Required]
 * @returns boolean
 */
function isNullOrEmptyOrUndefined(value) {
	return (
		value === null ||
		value === undefined ||
		value.length === 0 ||
		(typeof value === "object" && JSON.stringify(value) === "{}")
	);
}

/**
 * Verifica se a string informada é um GUID válido.
 *
 * @param {String} guid
 */
function isValidGUID(guid) {
	if (isNullOrEmptyOrUndefined(guid)) return false;
	guid = guid.trim().toLowerCase();
	var pattern = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");
	return pattern.test(guid);
}

/**
 * Verifica se o objeto informado é um array && se ele está preenchido com pelo menos 1 elemento.
 *
 * @param {*} object variável de qualquer tipo. [Required]
 */
function isAFilledArray(object) {
	return !isNullOrEmptyOrUndefined(object) && Array.isArray(object);
}

/**
 * Verifica se a string informada contém apenas números.
 *
 * @param {String} value string a ser verificada. [Required]
 * @param {Boolean} isRemoveFormat indicador para remover espaços e carateres especiais durante a verificação. [Default=true]
 */
function hasOnlyNumbers(value, isRemoveFormat = true) {
	if (isRemoveFormat) {
		value = removeFormat(value);
	}
	return /^\d+$/.test(value);
}

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
 * @param {String} cpf com ou sem formatação. [Required]
 * @returns {boolean}
 */
function isValidCPF(cpf) {
	cpf = removeFormat(cpf);
	var numbers, digits, sum, i, result, equalDigits;
	equalDigits = 1;
	if (cpf.length < 11) return false;
	for (i = 0; i < cpf.length - 1; i++)
		if (cpf.charAt(i) != cpf.charAt(i + 1)) {
			equalDigits = 0;
			break;
		}
	if (!equalDigits) {
		numbers = cpf.substring(0, 9);
		digits = cpf.substring(9);
		sum = 0;
		for (i = 10; i > 1; i--) sum += numbers.charAt(10 - i) * i;
		result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
		if (result != digits.charAt(0)) return false;
		numbers = cpf.substring(0, 10);
		sum = 0;
		for (i = 11; i > 1; i--) sum += numbers.charAt(11 - i) * i;
		result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
		if (result != digits.charAt(1)) return false;
		return true;
	} else return false;
}

/**
 * Verifica se o dispositivo é um Smartphone
 * Obs: Usa as larguras padrão do Bootstrap 4
 *
 * @returns {Boolean} True se o dispositivo for da largura de um smartphone ou menor. False caso contrário
 */
function isMobilePhone() {
	return window.innerWidth < 768;
}

/**
 * Verifica se o dispositivo é um Tablet
 * Obs: Usa as larguras padrão do Bootstrap 4
 *
 * @returns {Boolean} True se o dispositivo for da largura de um Tablet (menor que desktop e maior que smartphone). False caso contrário
 */
function isTablet() {
	return window.innerWidth < 992 && window.innerWidth >= 768;
}

/**
 * Verifica se o dispositivo é um Tablet ou menor
 * Obs: Usa as larguras padrão do Bootstrap 4
 *
 * @returns {Boolean} True se o dispositivo for da largura de um Tablet ou menor. False caso contrário
 */
function isMobilePhoneOrTablet() {
	return window.innerWidth < 992;
}

/**
 * Verifica se o dispositivo é um Desktop
 * Obs: Usa as larguras padrão do Bootstrap 4
 *
 * @returns {Boolean} True se o dispositivo for da largura de um Desktop ou maior. False caso contrário
 */
function isDesktopOrHigher() {
	return window.innerWidth > 992;
}

/**
 * Verifica se o dispositivo é um Desktop grande
 * Obs: Usa as larguras padrão do Bootstrap 4
 *
 * @returns {Boolean} True se o dispositivo for da largura de um Desktop ou maior. False caso contrário
 */
function isLargeDesktop() {
	return window.innerWidth > 1200;
}
//#endregion

/* ---------------------------------------------------
    CONVERSÕES
----------------------------------------------------- */
//#region
/**
 * Converte uma cor em Hexadecimal para RGB
 *
 * @param {String} hex no formato #000000
 * @returns {String} no formato "255, 255, 255"
 */
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) : null;
}

/**
 * Remove os acentos de uma string
 *
 * @param {String} string
 * @returns {String} exatamente a mesma, porém sem acentos
 */
function removeAccents(string) {
	const accents =
		"ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňñńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ";
	const accentsOut =
		"AAAAAAAAaaaaaaaaBOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnnRrSSSsssTtYYyyZZZzzzdGGgg";
	return string
		.split("")
		.map((letter, index) => {
			const accentIndex = accents.indexOf(letter);
			return accentIndex !== -1 ? accentsOut[accentIndex] : letter;
		})
		.join("");
}

function capitalizeName(name) {
	if (isNullOrEmptyOrUndefined(name)) return "";
	return name
		.trim()
		.split(" ")
		.map((word, index) => {
			if (word.toLowerCase() === "e" || (word.length <= 3 && word[0].toLowerCase() === "d"))
				return word.toLowerCase();
			return word[0].toUpperCase().concat(word.substr(1).toLowerCase());
		})
		.join(" ");
}

/**
 * Converte um valor em string para um Number
 *
 * @param {String} strValue valor com ponto ou vírgula
 * @param {String} thousandSeparator separador de milhar. [Default="."]
 * @param {String} decimalSeparator separador de casas decimais. [Default=","]
 */
function convertToNumber(strValue, thousandSeparator = ".", decimalSeparator = ",") {
	if (thousandSeparator != null && thousandSeparator != undefined)
		strValue = strValue.replaceAll(thousandSeparator, "");
	var value = strValue.split(decimalSeparator)[0];
	var decimals = strValue.split(decimalSeparator)[1];
	if (decimals == undefined) decimals = "";
	return parseFloat(value.replace(/\D/g, "") + "." + decimals.replace(/\D/g, ""));
}

/**
 * Retorna uma String com o valor informado formatado.
 *
 * @example
 * formatNumber(15.2) => "15,20"
 * formatNumber(15.2, "R$ ") => "R$ 15,20"
 * formatNumber(3215.2) => "3.215,20"
 * formatNumber(3215.2, "R$ ") => "R$ 3.215,20"
 * formatNumber(987654.321, "U$ ", "*", ":", 1) => "U$ 987*654:3"
 *
 * @param {Number} value valor que será formatado [Required];
 * @param {String} prefix Símbolo da moeda, por exemplo.
 * @param {String} thousandSeparator separador de milhar. Caso não seja informado, será considerado ".";
 * @param {String} decimalSeparator separador de casas decimais. Caso não seja informado, será considerado ",";
 * @param {Number} decimalPlaces quantidade de casas decimais a serem consideradas;
 * @returns {String} valor formatado || null caso o {value} esteja null, undefined ou não seja do tipo "number"
 */
function formatNumber(value, prefix = null, thousandSeparator = ".", decimalSeparator = ",", decimalPlaces = 2) {
	if (value === null || value === undefined || typeof value !== "number") return null;
	decimalPlaces = !isNaN((decimalPlaces = Math.abs(decimalPlaces))) ? decimalPlaces : 2;
	prefix = prefix !== undefined && prefix !== null ? prefix : "";
	thousandSeparator = thousandSeparator || ",";
	decimalSeparator = decimalSeparator || ".";
	var number = value,
		negative = number < 0 ? "-" : "",
		i = parseInt((number = Math.abs(+number || 0).toFixed(decimalPlaces)), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return (
		prefix +
		negative +
		(j ? i.substr(0, j) + thousandSeparator : "") +
		i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandSeparator) +
		(decimalPlaces
			? decimalSeparator +
			  Math.abs(number - parseInt(i))
					.toFixed(decimalPlaces)
					.slice(2)
			: "")
	);
}

/**
 * Retorna um booleano de acordo com o valor informado
 *
 * @param {String|Number} value
 * @returns {boolean} true ou false
 */
function getBooleanValue(value) {
	if (value === "true" || value === "True" || value === "1" || value === 1 || value === true) return true;
	return false;
}
//#endregion

/* ---------------------------------------------------
    UTILITÁRIOS
----------------------------------------------------- */
//#region
/**
 * Retorna uma String com o número informado e a quantidade desejada de zeros a esquerda.
 * Caso o size seja menor ou igual ao number, retorna o próprio number inalterado.
 *
 * @example
 * fillLeftZero(27, 5) => "00027";
 * fillLeftZero(1, 3) => "001";
 * fillLeftZero(7244, 3) => "7244";
 * fillLeftZero(36, 2) => "36"
 *
 * @param {Number} number número qualquer, Ex: 8 [Required]
 * @param {Number} size tamanho final da String, Ex: 3 [Required]
 * @returns {String}  resultado final, Ex: "008"
 */
function fillWithZero(number, size) {
	var s = number + "";
	while (s.length < size) s = "0" + s;
	return s;
}

/**
 * Executa um forEach() de forma assíncrona com await.
 *
 * @param {Array} array lista que será percorrida [Required]
 * @param {Function} callback função que será executada dentro do laço [Required]
 */
async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

/**
 * Gera um id único com 9 caracteres alfanuméricos(letras sempre em minúsculo)
 *
 * @returns {string} novo id
 */
function newId() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return Math.random()
		.toString(36)
		.substr(2, 9);
}

/**
 * Retorna o caminho completo de um atributo de um determinado objeto.
 * Ex:
 *
 * @example
 * var myObj = {'a': {'b': {'c': {'x': 1, 'y': 2 }}}};
 * findPropPath(myObj, 'x')
 * return: "a.b.c.x"
 * @param {Object} obj objeto pai
 * @param {string} name nome da atributo
 * @returns {string} caminho completo do atributo
 */
function findPropPath(obj, name) {
	for (var prop in obj) {
		if (prop == name) {
			return name;
		} else if (typeof obj[prop] == "object") {
			var result = findPropPath(obj[prop], name);
			if (result) {
				return prop + "." + result;
			}
		}
	}
	return null; // Not strictly needed, but good style
}

/**
 * Retorna um inteiro gerado aleatoriamente entre dois números
 *
 * @param {Number} min intervalo fechado
 * @param {Number} max intervalo fechado
 * @returns {Number} valor entre o [min] e o [max]
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gera uma chave aleatória alfanumérica (letras em maiúsculo e minúsculo) com o tamanho informado
 *
 * @param {Number} keyLength tamanho da chave. Default: 10
 * @returns {String} chave gerada
 */
function generateKey(keyLength = 10) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < keyLength; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

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
	return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
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
 * Busca uma propriedade qualquer de um objeto qualquer (independente se estiver dentro de outras)
 *
 * @param {Object} obj Objeto onde será realizada a busca
 * @param {String} prop nome da propriedade
 */
function fetchFromObject(obj, prop) {
	if (typeof obj === "undefined") {
		return false;
	}

	var _index = prop.indexOf(".");
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
function clone(obj, hash = new WeakMap()) {
	if (Object(obj) !== obj) {
		// tipos primitivos
		return obj;
	}

	if (hash.has(obj)) {
		// referências cíclicas
		return hash.get(obj);
	}

	const result =
		obj instanceof Date
			? new Date(obj)
			: obj instanceof RegExp
			? new RegExp(obj.source, obj.flags)
			: obj.constructor
			? new obj.constructor()
			: Object.create(null);

	hash.set(obj, result);

	if (obj instanceof Map) {
		Array.from(obj, ([key, val]) => result.set(key, clone(val, hash)));
	}

	return Object.assign(
		result,
		...Object.keys(obj).map(key => ({
			[key]: clone(obj[key], hash)
		}))
	);
}

/**
 * Função de paginação para qualquer array ou lista de itens.
 *
 * @param {number} totalItems [Required] Total de itens a serem paginados
 * @param {number} currentPage [Optional] Número da pagina ativa (começa em 1)
 * @param {number} pageSize [Optional] Número máximo de itens por página (Default = 10)
 * @param {number} maxPages [Optional] Número máximo de páginas a serem exibidas (Default = 10)
 * @returns {Object} Contém todas as informações necessárias para exibição da paginação dos itens e seus respectivos links
 */
function paginate(totalItems, currentPage = 1, pageSize = 10, maxPages = 10) {
	// calculate total pages
	let totalPages = Math.ceil(totalItems / pageSize);

	// ensure current page isn't out of range
	if (currentPage < 1) {
		currentPage = 1;
	} else if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	let startPage, endPage;
	if (totalPages <= maxPages) {
		// total pages less than max so show all pages
		startPage = 1;
		endPage = totalPages;
	} else {
		// total pages more than max so calculate start and end pages
		let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
		let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
		if (currentPage <= maxPagesBeforeCurrentPage) {
			// current page near the start
			startPage = 1;
			endPage = maxPages;
		} else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
			// current page near the end
			startPage = totalPages - maxPages + 1;
			endPage = totalPages;
		} else {
			// current page somewhere in the middle
			startPage = currentPage - maxPagesBeforeCurrentPage;
			endPage = currentPage + maxPagesAfterCurrentPage;
		}
	}

	// calculate start and end item indexes
	let startIndex = (currentPage - 1) * pageSize;
	let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

	// create an array of pages to ng-repeat in the pager control
	let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(i => startPage + i);

	// return object with all pager properties required by the view
	return {
		totalItems: totalItems,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: totalPages,
		startPage: startPage,
		endPage: endPage,
		startIndex: startIndex,
		endIndex: endIndex,
		pages: pages
	};
}


/**
 * Retorna um array de números entre os start e end (intervalo fechado).
 *
 * @param {int} start
 * @param {int} end
 * @returns {Array}
 */
function range(start, end) {
	if (start === end) return [start];
	return [start, ...range(start + 1, end)];
}

//#endregion
