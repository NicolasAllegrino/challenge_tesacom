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
var data6 = { "var1": -55, "ASCII1": "A~^s#0", "var2": 268, "ASCII2": "Prueba Buffer ASCII#0" };
var data7 = { "ASCII": "0#0", "ASCII2": "P#0" };

describe('Tests encode', () => {
    test('Pass encode', () => {
        var result = encode.encode(data1, format1);
        expect(result.buffer.toString('hex')).toBe('10c0e073');
        expect(result.size).toBe(4);

        result = encode.encode(data2, format2);
        expect(result.buffer.toString('hex')).toBe('0fffffc180e07310c3de');
        expect(result.size).toBe(10);

        result = encode.encode(data3, format3);
        expect(result.buffer.toString('hex')).toBe('4392ae144211cccd');
        expect(result.size).toBe(8);

        result = encode.encode(data4, format4);
        expect(result.buffer.toString('hex')).toBe('43493852440b233373fffffef441b06666427d70a4');
        expect(result.size).toBe(21);

        result = encode.encode(data5, format5);
        expect(result.buffer.toString('hex')).toBe('20febdcf0236000000803429558b0a7a06285054df937a046c270f');
        expect(result.size).toBe(27);

        result = encode.encode(data6, format6);
        expect(result.buffer.toString('hex')).toBe('01ff9307f5ee68d808650e5d72e2c282175cd9b2f241069c393251b0');
        expect(result.size).toBe(28);

        result = encode.encode(data7, format7);
        expect(result.buffer.toString('hex')).toBe('0182361411b0');
        expect(result.size).toBe(6);
    });

    test('Fatal error encode', () => {
        const result = encode.encode("", "");
        expect(result).toBe('Fatal error');
    });

    test('Error1 encode', () => {
        const result = encode.encode(data1, format1.splice(0, 1));
        expect(result).toBe('Error1');
    });
});