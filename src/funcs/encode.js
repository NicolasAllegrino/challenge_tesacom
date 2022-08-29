const { Buffer } = require('buffer');
const bignumber = require('./bignumber.min.js');

/**
 * Codificación de datos establecidos de un objeto
 * a un Buffer,
 * con formato establecido por format.
 * @param {Object} _object Object con los valores a codificar { tag: value }
 * @param {Array<Object>} format Array con objetos que determinan el tipo de dato a codificar [ { tag: "?", type: "?", len: ? } ]
 * @returns {{size<number>, Buffer<Buffer>}}
 */
function encodeData(_object, format) {
    try {
        //Incompatibilidad entre la cantidad de datos y la cantidad de tipos de datos
        if (Object.keys(_object).length != Object.keys(format).length) {
            return 'Error1';
        } else {
            let buffer = "";
            format.map(function(f) {
                val = _object[f.tag];
                //Conversion para tipo de dato uint
                if (f.type == "uint") {
                    val = convertToBinary(val);
                    if (val.length != f.len) {
                        val = '0'.repeat(f.len - val.length) + val.toString();
                    }
                    buffer += val;
                }
                //Conversion para tipo de dato int con signo
                else if (f.type == "int") {
                    let num = parseInt(_object[f.tag]);
                    let numOr = num;
                    if (num < 0) {
                        num = num * -1;
                    }

                    num = num.toString(2);
                    let lenNum = num.toString().length;
                    //Determino la cantidad de bit adecuada para el int con signo (16 ó 32 bit)
                    if (lenNum <= 8) {
                        num = '0'.repeat(16 - lenNum) + num.toString();
                        lenNum = 16;
                    } else if (lenNum <= 32) {
                        num = '0'.repeat(32 - lenNum) + num.toString();
                        lenNum = 32;
                    }

                    //Si el valor es negativo lo convierto en complemento a 2
                    num = num.toString();
                    if (numOr < 0) {
                        numOr = numOr * -1;
                        let str = "";
                        let c = 2;
                        if (num % 2 == 0) {
                            let div = num / 2;
                            while (div % 2 == 0) {
                                c += 1;
                                div = div / 2;
                            }
                            let i = 0;
                            for (i = 0; lenNum - c > i; i++) {
                                (num[i] == 1) ? str += '0': str += '1';
                            }
                            for (i = i; lenNum - 1 > i; i++) {
                                str += num[i];
                            }
                        } else {
                            for (let i = 0; lenNum - 1 > i; i++) {
                                (num[i] == 1) ? str += '0': str += '1';
                            }
                        }

                        ((numOr % 2) == 0) ? str += '0': str += '1';

                        buffer += str;
                    } else {
                        buffer += num;
                    }
                }
                //Conversión para tipo de dato float
                else if (f.type == "float") {
                    // console.log(Float32ToBin(val));
                    buffer += Float32ToBin(val);
                }
                //Conversión para tipo de dato ASCII
                else if (f.type == "ascii") {
                    val = Buffer.from(val, 'ascii');

                    let buf1 = "";
                    for (let c of val) {
                        c = c.toString(2)
                        if (c.length < 7) {
                            c = '0'.repeat(7 - c.length) + c;
                        }
                        buf1 += c;
                    }
                    buffer += buf1.toString(2);
                }
            });

            //Convierto el string buffer en valor hexadecimal
            buffer = new bignumber.BigNumber(buffer, 2).toString(16);
            strBuffer = buffer.toString();
            if (strBuffer.length % 2 != 0) { strBuffer = '0' + strBuffer }

            //Creo el buffer con los datos
            buffer = Buffer.from(strBuffer, 'hex');
            //Tamaño del Buffer
            let size = buffer.byteLength;

            return { size, buffer };
        }
    } catch (error) {
        return 'Fatal error';
    }
}


//UTILIDADES
/**
 * Conversión a binario
 * @param {Number} number 
 * @returns {String} String de binario
 */
function convertToBinary(number) {
    let num = number;
    let binary = (num % 2).toString();
    for (; num > 1;) {
        num = parseInt(num / 2);
        binary = (num % 2) + (binary);
    }
    return binary;
}

/**
 * Conversión de Foat32 a String de Binario
 * @param {Number} float32 
 * @returns 
 */
function Float32ToBin(float32) {
    const HexToBin = hex => (parseInt(hex, 16).toString(2)).padStart(32, '0');
    const getHex = i => ('00' + i.toString(16)).slice(-2);
    var view = new DataView(new ArrayBuffer(4))
    view.setFloat32(0, float32);
    return HexToBin(Array.apply(null, { length: 4 }).map((_, i) => getHex(view.getUint8(i))).join(''));
}

module.exports = encodeData;