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
            throw new Error("Incompatibilidad entres cantidas de datos y cantidad de formatos.");
        } else {
            let buf = "";
            let size = 0;
            format.map(function(f) {
                val = _object[f.tag];

                if (f.len != undefined) {
                    maxVal = Math.pow(2, f.len);
                    if (val > maxVal) {
                        throw new Error("Valor de " + f.tag + " fuera del rango para len " + f.len);
                    }
                }

                let lb = 0;

                //Conversion para tipo de dato uint
                if (f.type == "uint") {
                    lb = f.len;
                    if ((lb % 4 != 0)) {
                        lb = parseInt(f.len / 4);
                        lb = lb + 1;
                    } else {
                        lb = lb / 4;
                    }
                    val = val.toString(16).padStart(lb, '0');
                    buf += val;

                    size += f.len;
                }
                //Conversion para tipo de dato int con signo
                else if (f.type == "int") {
                    if (val < 0) {
                        val = parseInt((val >>> 0).toString(2).substring(32 - f.len), 2);
                    }
                    lb = f.len;
                    if ((lb % 4 != 0)) {
                        lb = parseInt(f.len / 4);
                        lb = lb + 1;
                    } else {
                        lb = lb / 4;
                    }
                    val = val.toString(16).padStart(lb, '0');
                    buf += val;

                    size += f.len;
                }
                //Conversión para tipo de dato float
                else if (f.type == "float") {
                    val = parseInt(Float32ToBin(val), 2);

                    lb = 8;
                    val = val.toString(16).padStart(lb, '0');
                    buf += val;

                    size += 32;
                }
                //Conversión para tipo de dato ASCII
                else if (f.type == "ascii") {
                    val = Buffer.from(val, 'ascii');

                    for (let c of val) {
                        buf += parseInt(c).toString(16);
                        size += 7;
                    }
                }
            });

            if (buf.length % 2 != 0) {
                buf = buf + '0';
            }

            //Creo el buffer con los datos
            let buffer = Buffer.from(buf, 'hex');

            return { size, buffer };
        }
    } catch (error) {
        throw error;
    }
}

//UTILIDADES
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