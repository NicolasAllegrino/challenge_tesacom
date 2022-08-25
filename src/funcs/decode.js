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
        let sfloat = 0;
        let a = 0;
        let size = 0;
        format.map(function(f) {
            if (f.type == "uint") {
                sfloat = 1;
                size += f.len;
            };
            if (f.type == "int") {
                suint = 1;
                sfloat = 1;
                size += (f.len <= 8) ? 16 : 32;
            };
            if ((f.type == "float")) {
                if (a >= 1) {
                    sfloat = 1;
                }
                size += 32;
                a++;
            }
        });
        // let size = (a != 0) ? (32 * a) : format.reduce((sum, value) => (sum + value.len), 0);
        if (by.length != size || suint == 0 || sfloat == 0) {
            by = '0'.repeat(size - by.length) + by.toString();
        }

        let response = {};
        let i = 0;
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
                value = by.toString().substring(i, i + f.len);
                let xnum = new bignumber.BigNumber(value, 2);
                if (value.length == 8 && x.gte("80", 16)) { xnum = xnum.minus("100", 16) };
                if (value.length == 16 && x.gte("8000", 16)) { xnum = xnum.minus("10000", 16) };
                if (value.length == 32 && x.gte("80000000", 16)) { xnum = xnum.minus("100000000", 16) };

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

module.exports = decodeData;