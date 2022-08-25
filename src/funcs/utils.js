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