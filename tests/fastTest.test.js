const encdec = require('../src/index');

const format = [
    { tag: "var1", type: "float" },
    { tag: "var3", type: "uint", len: 2 },
    { tag: "ASCII1", type: "ascii" },
    { tag: "var2", type: "float" },
    { tag: "var4", type: "int", len: 12 },
    { tag: "ASCII2", type: "ascii" },
    { tag: "var5", type: "float" },
    { tag: "var6", type: "float" },
    { tag: "var7", type: "int", len: 8 }
];
var data = { "var1": -3.3333, "var3": 2, "ASCII1": "(Prueba ASCII)#0", "var2": 556.55, "var4": 268, "ASCII2": "ASCII 2 #0", "var5": 22.05987, "var6": 63.36, "var7": -63 };

describe('Tests encode', () => {
    test('Pass encode-decode', () => {
        let dataEncode = encdec.encode(data, format);
        console.log(dataEncode);

        let dataDecode = encdec.decode(dataEncode.buffer, format);
        console.log(dataDecode);

        expect(dataDecode['ASCII1']).toBe(data["ASCII1"]);
    });
});