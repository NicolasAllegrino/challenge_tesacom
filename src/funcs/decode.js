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
        var buf = buffer.toString('hex');

        let response = {};
        let i = 0;
        format.map(function(f) {
            //Conversion para tipo de dato uint
            if (f.type == "uint") {
                if ((f.len % 4 != 0)) {
                    f.len = parseInt(f.len / 4);
                    f.len = f.len + 1;
                } else {
                    f.len = f.len / 4;
                }
                val = parseInt(buf.substring(i, (i + f.len)), 16);
                response[f.tag] = val;

                i += f.len;
            }
            //Conversion para tipo de dato uint
            else if (f.type == "int") {
                li = f.len;
                if ((f.len % 4 != 0)) {
                    f.len = parseInt(f.len / 4);
                    f.len = f.len + 1;
                } else {
                    f.len = f.len / 4;
                }

                subf = parseInt(buf.substring(i, (i + f.len)), 16).toString(2).padStart(li, '0');
                if (subf[0] == 1 && (subf.length == li)) {
                    val = subf.toString(2).padStart(32, 1);
                    val = (parseInt(val, 2) << 0);
                    response[f.tag] = parseInt(val);
                } else {
                    response[f.tag] = parseInt(subf, 2);
                }
                i += f.len;
            }
            //Conversion para tipo de dato float
            else if (f.type == "float") {
                f.len = 8;
                val = parseInt(buf.substring(i, (i + f.len)), 16).toString(2);
                val = BinToFloat32(val);

                response[f.tag] = parseFloat(val);
                i += f.len;
            }
            //Cnversion para tipo de dato ASCII
            else if (f.type == "ascii") {
                val = buf.substring(i, (i + (buf.substring(i).indexOf(2330) + 4)));
                let ca = val.length / 2;
                let caux = "";
                let cauxout = "";
                for (let ci = 0; ci < ca; ci++) {
                    caux = parseInt(val.substring(((2 * ci)), ((2 * ci) + 2)), 16).toString(2);
                    cauxout += BinToAscii(caux);
                }

                response[f.tag] = cauxout;
                i += cauxout.length * 2;
            }
        });

        return response;
    } catch (error) {
        throw error;
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