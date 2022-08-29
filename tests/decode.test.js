const decode = require('../src/index');
const { Buffer } = require('buffer');

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

var dataBuffer1 = Buffer.from('10c0e073', 'hex');
var data1 = { "PTemp": 268, "BattVolt.value": 224, "WaterLevel": 115 };

var dataBuffer2 = Buffer.from('0fffffc180e07310c3de', 'hex');
var data2 = { "var1": -1000, "var2": 224, "var3": 115, "var4": 268, "var5": 990 };

var dataBuffer3 = Buffer.from('4392ae144211cccd', 'hex');
var data3 = { "var1": 293.3599853515625, "var2": 36.45000076293945 };

var dataBuffer4 = Buffer.from('43493852440b233373fffffef441b06666427d70a4', 'hex');
var data4 = { "var1": 201.22000122070312, "var2": 556.5499877929688, "var3": 115, "var4": -268, "var5": 22.049999237060547, "var6": 63.36000061035156 };

var dataBuffer5 = Buffer.from('20febdcf0236000000803429558b0a7a06285054df937a046c270f', 'hex');
var data5 = { "ASCII": "A~^s`#0", "var1": 1025, "ASCII2": "PRUEBO 1! Todo #0", "var2": 9999 };

var dataBuffer6 = Buffer.from('01ff9307f5ee68d808650e5d72e2c282175cd9b2f241069c393251b0', 'hex');
var data6 = { "var1": -55, "ASCII1": "A~^s#0", "var2": 268, "ASCII2": "Prueba Buffer ASCII#0" };

describe('Tests decode', () => {
    test('Pass decode', () => {
        var result = decode.decode(dataBuffer1, format1);
        expect(result["PTemp"]).toBe(data1["PTemp"]);
        expect(result["BattVolt.value"]).toBe(data1["BattVolt.value"]);
        expect(result["WaterLevel"]).toBe(data1["WaterLevel"]);

        result = decode.decode(dataBuffer2, format2);
        expect(result["var1"]).toBe(data2["var1"]);
        expect(result["var2"]).toBe(data2["var2"]);
        expect(result["var3"]).toBe(data2["var3"]);
        expect(result["var4"]).toBe(data2["var4"]);
        expect(result["var5"]).toBe(data2["var5"]);

        result = decode.decode(dataBuffer3, format3);
        expect(result["var1"]).toBe(data3["var1"]);
        expect(result["var2"]).toBe(data3["var2"]);

        result = decode.decode(dataBuffer4, format4);
        expect(result["var1"]).toBe(data4["var1"]);
        expect(result["var2"]).toBe(data4["var2"]);
        expect(result["var3"]).toBe(data4["var3"]);
        expect(result["var4"]).toBe(data4["var4"]);
        expect(result["var5"]).toBe(data4["var5"]);
        expect(result["var6"]).toBe(data4["var6"]);

        result = decode.decode(dataBuffer5, format5);
        expect(result["ASCII"]).toBe(data5["ASCII"]);
        expect(result["ASCII2"]).toBe(data5["ASCII2"]);
        expect(result["var1"]).toBe(data5["var1"]);
        expect(result["var2"]).toBe(data5["var2"]);

        result = decode.decode(dataBuffer6, format6);
        expect(result["var1"]).toBe(data6["var1"]);
        expect(result["ASCII1"]).toBe(data6["ASCII1"]);
        expect(result["var2"]).toBe(data6["var2"]);
        expect(result["ASCII2"]).toBe(data6["ASCII2"]);
    });

    test('Fatal error decode', () => {
        const result = decode.decode("", "");
        expect(result).toBe('Fatal error');
    });
});