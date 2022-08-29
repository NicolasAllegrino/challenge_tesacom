const encodeData = require('./funcs/encode');
const decodeData = require('./funcs/decode');

module.exports = {
    /**
     * Codificación de datos establecidos de un objeto
     * a un Buffer,
     * con formato establecido por format.
     * 
     * @param {Object} _object Object con los valores a codificar { tag: value }
     * @param {Array<Object>} format Array con objetos que determinan el tipo de dato a codificar [ { tag: "?", type: "?", len: ? } ]
     * @returns {{size<number>, Buffer<Buffer>}}
     */
    encode(_object, format) {
        return encodeData(_object, format);
    },


    /**
     * Decodificación de datos recibidos en el Buffer
     * a un Objeto,
     * con formato establecido por format.
     * 
     * 
     * @param {Buffer} buffer Buffer con los datos a decodificar (hex)
     * @param {Array<Object>} format Array con objetos que determinal el tipo de dato a decodificar [ { tag: "?", type: "?", len: ? } ]
     * @returns {{tag: value}} Devuelvo un objeto, con formato { 'tag':value, ... } determinados por los format.tag y su valor correspondiente decodificado
     */
    decode(buffer, format) {
        return decodeData(buffer, format);
    }
};