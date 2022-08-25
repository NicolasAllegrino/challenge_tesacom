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

var data1 = { "PTemp": 268, "BattVolt.value": 224, "WaterLevel": 115 };
var data2 = { "var1": -1000, "var2": 224, "var3": 115, "var4": 268, "var5": 990 };
var data3 = { "var1": 293.36, "var2": 36.45 };
var data4 = { "var1": 201.22, "var2": 556.55, "var3": 115, "var4": -268, "var5": 22.05, "var6": 63.36 };

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