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

var dataBuffer1 = Buffer.from('10c0e073', 'hex');
var data1 = { "PTemp": 268, "BattVolt.value": 224, "WaterLevel": 115 };

var dataBuffer2 = Buffer.from('0fffffc180e07310c3de', 'hex');
var data2 = { "var1": -1000, "var2": 224, "var3": 115, "var4": 268, "var5": 990 };

var dataBuffer3 = Buffer.from('4392ae144211cccd', 'hex');
var data3 = { "var1": 293.3599853515625, "var2": 36.45000076293945 };

var dataBuffer4 = Buffer.from('43493852440b233373fffffef441b06666427d70a4', 'hex');
var data4 = { "var1": 201.22000122070312, "var2": 556.5499877929688, "var3": 115, "var4": -268, "var5": 22.049999237060547, "var6": 63.36000061035156 };


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

        result = decode.decode(dataBuffer4, format4);
        expect(result["var1"]).toBe(data4["var1"]);
        expect(result["var2"]).toBe(data4["var2"]);
        expect(result["var3"]).toBe(data4["var3"]);
        expect(result["var4"]).toBe(data4["var4"]);
        expect(result["var5"]).toBe(data4["var5"]);
        expect(result["var6"]).toBe(data4["var6"]);
    });

    test('Fatal error decode', () => {
        const result = decode.decode("", "");
        expect(result).toBe('Fatal error');
    });
});