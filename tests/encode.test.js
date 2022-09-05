const encode = require('../src/index');

const format1 = [
    { tag: "PTemp", type: "uint", len: 12 },
    { tag: "BattVolt.value", type: "uint", len: 12 },
    { tag: "WaterLevel", type: "uint", len: 8 }
];
const format2 = [
    { tag: "var1", type: "int", len: 12 },
    { tag: "var2", type: "uint", len: 12 },
    { tag: "var3", type: "uint", len: 8 },
    { tag: "var4", type: "uint", len: 12 },
    { tag: "var5", type: "uint", len: 12 }
];
const format3 = [
    { tag: "var1", type: "float" },
    { tag: "var2", type: "float" }
];
const format4 = [
    { tag: "var1", type: "float" },
    { tag: "var2", type: "float" },
    { tag: "var3", type: "uint", len: 8 },
    { tag: "var4", type: "int", len: 12 },
    { tag: "var5", type: "float" },
    { tag: "var6", type: "float" },
];
const format5 = [
    { tag: "ASCII", type: "ascii" },
    { tag: "var1", type: "int", len: 12 },
    { tag: "ASCII2", type: "ascii" },
    { tag: "var2", type: "uint", len: 14 }
];
const format6 = [
    { tag: "var1", type: "int", len: 8 },
    { tag: "ASCII1", type: "ascii" },
    { tag: "var2", type: "uint", len: 12 },
    { tag: "ASCII2", type: "ascii" }
];
const format7 = [
    { tag: "ASCII", type: "ascii" },
    { tag: "ASCII2", type: "ascii" }
];

var data1 = { "PTemp": 268, "BattVolt.value": 224, "WaterLevel": 115 };
var data2 = { "var1": -1000, "var2": 224, "var3": 115, "var4": 268, "var5": 990 };
var data3 = { "var1": 293.36, "var2": 36.45 };
var data4 = { "var1": 201.22, "var2": 556.55, "var3": 115, "var4": -268, "var5": 22.05, "var6": 63.36 };
var data5 = { "ASCII": "A~^s`#0", "var1": 1025, "ASCII2": "PRUEBO 1! Todo #0", "var2": 9999 };
var data6 = { "var1": -55, "ASCII1": "(A~^s)#0", "var2": 268, "ASCII2": "Prueba Buffer ASCII#0" };
var data7 = { "ASCII": "0#0", "ASCII2": "P#0" };

describe('Tests encode', () => {
    test('Pass encode', () => {
        result = encode.encode(data1, format1);
        expect(result.buffer.toString('hex')).toBe('10c0e073');
        expect(result.size).toBe(32);

        result = encode.encode(data2, format2);
        expect(result.buffer.toString('hex')).toBe('c180e07310c3de');
        expect(result.size).toBe(56);

        result = encode.encode(data3, format3);
        expect(result.buffer.toString('hex')).toBe('4392ae144211cccd');
        expect(result.size).toBe(64);

        result = encode.encode(data4, format4);
        expect(result.buffer.toString('hex')).toBe('43493852440b233373ef441b06666427d70a40');
        expect(result.size).toBe(148);

        result = encode.encode(data5, format5);
        expect(result.buffer.toString('hex')).toBe('417e5e7360233040150525545424f20312120546f646f202330270f0');
        expect(result.size).toBe(194);

        result = encode.encode(data6, format6);
        expect(result.buffer.toString('hex')).toBe('c928417e5e7329233010c5072756562612042756666657220415343494923300');
        expect(result.size).toBe(223);

        result = encode.encode(data7, format7);
        expect(result.buffer.toString('hex')).toBe('302330502330');
        expect(result.size).toBe(42);
    });
});