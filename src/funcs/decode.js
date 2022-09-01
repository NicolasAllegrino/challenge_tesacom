const bignumber = require('./bignumber.min.js');

/**
 * Decodificación de datos recibidos en el Buffer
 * a un Objeto,
 * con formato establecido por format.
 * @param {Buffer} buffer Buffer con los datos a decodificar (hex)
 * @param {Array<Object>} format Array con objetos que determinal el tipo de dato a decodificar [ { tag: "?", type: "?", len: ? } ]
 * @returns {{tag: value}} Devuelvo un objeto, tipo diccionario 'key':value, determinados por los format.tag y su valor correspondiente decodificado
 */
function decodeData(buffer, format) {
    try {
        var x = new bignumber.BigNumber(buffer.toString('hex'), 16);

        let by = x.toString(2);
        let suint = 0;
        let a = 0;
        let size = 0;
        let sub1 = by;
        let sisesub1 = 0;
        let iasc = [];
        format.map(function(f) {
            if (f.type == "uint") {
                suint = 1;
                size += f.len;
            };
            if (f.type == "int") {
                suint = 1;
                size += (f.len <= 8) ? 16 : 32;
            };
            if ((f.type == "float")) {
                if (a >= 1) {
                    suint = 1;
                }
                size += 32;
                a++;
            }
            if ((f.type == "ascii")) {
                suint = 1;
                if (iasc.length == 0) {
                    sisesub1 = sub1.indexOf('01000110110000') + 14;
                    iasc.push(sub1.indexOf('01000110110000') + 14);
                } else {
                    sisesub1 = sub1.substring(iasc.length - 1).indexOf('01000110110000') + 14;
                    iasc.push(sub1.substring(iasc.length - 1).indexOf('01000110110000') + 14 + iasc[iasc.length - 1]);
                }
                sub1 = sub1.substring(iasc[iasc.length - 1]);
                size += sisesub1;
            }
        });

        if ((by.length != size && iasc.length == 0) || suint == 0) {
            by = '0'.repeat(size - by.length) + by.toString();
        };

        let response = {};
        let i = 0;
        let iiasc = 0;
        let aasc = 0;
        format.map(function(f) {
            //Conversion para tipo de dato uint
            if (f.type == "uint") {
                value = parseInt(by.slice(i, (i + f.len)), 2);
                response[f.tag] = value;
                i += f.len;
            }
            //Conversion para tipo de dato uint
            else if (f.type == "int") {
                f.len = (f.len <= 8) ? 16 : 32;
                val = by.toString().substring(i, i + f.len);
                let xnum = new bignumber.BigNumber(val, 2);
                if (val[0] == 1) {
                    if (val.length == 8 && x.gte("80", 16)) { xnum = xnum.minus("100", 16) };
                    if (val.length == 16 && x.gte("8000", 16)) { xnum = xnum.minus("10000", 16) };
                    if (val.length == 32 && x.gte("80000000", 16)) { xnum = xnum.minus("100000000", 16) };
                }

                response[f.tag] = parseInt(xnum);
                i += f.len;
            }
            //Conversion para tipo de dato float
            else if (f.type == "float") {
                f.len = 32;
                value = BinToFloat32(by.toString(10).substring(i, i + f.len));

                response[f.tag] = parseFloat(value);
                i += f.len;
            }
            //Cnversion para tipo de dato ASCII
            else if (f.type == "ascii") {
                val = by.toString().substring(i, iasc[iiasc] - 14);
                let ca = val.length / 7;
                if (iiasc == 0 && aasc == 0 && ca % 1 != 0) {
                    val = by.toString().substring(i - 1, iasc[iiasc] - 14);
                    val = '0' + val.toString();
                    sumi = 13;
                } else {
                    sumi = 14;
                }
                let caux = "";
                let cauxout = "";
                let ci = 0;
                for (ci = 0; ci < ca; ci++) {
                    caux = (ci == 0) ? val.substring(0, 7) : val.substring(((7 * ci)), ((7 * (ci + 1))));
                    if (caux.length < 7) {
                        caux = '0'.repeat(7 - caux.length) + caux.toString();
                    }
                    cauxout += BinToAscii(caux);
                }

                response[f.tag] = cauxout + "#0";

                i += val.length + sumi;
                iiasc++;
            }
            aasc++;
        });

        return response;
    } catch (error) {
        return 'Fatal error';
    }
}


//UTILIDADES
/**
 * Conversión de String Binario a Float32
 * @param {String} str 
 * @returns {float32}
 */
function BinToFloat32(str) {
    var int = parseInt(str, 2);
    if (int > 0 || int < 0) {
        var sign = (int >>> 31) ? -1 : 1;
        var exp = (int >>> 23 & 0xff) - 127;
        var mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
        var float32 = 0
        for (i = 0; i < mantissa.length; i += 1) {
            float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
            exp--
        }
        return float32 * sign;
    } else return 0
}

/**
 * Conversión de String Binario a ASCII
 * @param {String} str String de trama binaria a decodificar en ASCII
 * @returns {String} Cadena de carácteres
 */
function BinToAscii(str) {
    var i = 0,
        l = str.length,
        chr, out = '';
    for (; i < l; i += 8) {
        chr = parseInt(str.substring(i, 8), 2).toString(16);
        out += '%' + ((chr.length % 2 == 0) ? chr : '0' + chr);
    }
    return decodeURIComponent(out);
}

module.exports = decodeData;