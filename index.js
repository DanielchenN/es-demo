"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var elasticsearch_1 = require("elasticsearch");
var client = new elasticsearch_1.Client({ host: 'http://localhost:9200' });
client.ping({
    requestTimeout: 30000
}, function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('gogogo');
    }
});
// 新建一个索引
client.indices.create({
    index: 'myfirst.indexx'
}, function (err, data) {
    if (err) {
        // console.log(err)
    }
    else {
        console.log('create success', data);
    }
});
// 既然添加了索引，肯定是要把索引应用
/**
 * Adds a JSON document to the specified index and makes it searchable.
 * If the document already exists, updates the document and increments its version.
 */
client.index({
    index: 'scotch.io-tutorial',
    id: '1',
    type: 'first_list',
    body: {
        "Key1": "Content for key one",
        "Key2": "Content for key two",
        "key3": "Content for key three"
    }
}, function (err, resp) {
    // console.log('resp', resp)
});
// 这个void可以不写，用于推断 --- 空查询{}, 等价于 match_all
var bulkMatchAll = function (params) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        query: {
                            match_all: {}
                        },
                        size: 100
                    };
                    return [4 /*yield*/, client.search({ index: 'cities.index', body: body, type: 'cities_list' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
var buikMatch = function (params) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        query: {
                            match: {
                                country: 'AE' // 通过名字 key 进行 match
                            }
                        },
                        size: 100
                    };
                    return [4 /*yield*/, client.search({ index: 'cities.index', body: body, type: 'cities_list' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
/**
 * must 和 should 的区别:
 * see at @https://stackoverflow.com/questions/28768277/elasticsearch-difference-between-must-and-should-bool-query
 * must相当于 &&, should 相当于 ||
 * should / must 可以接受一个数组查询多个  和用 空格 分割的是等价的
 */
var matchBool = function (params) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        query: {
                            bool: {
                                must: { match: { name: 'Agara' } }
                            }
                        },
                        size: 100
                    };
                    return [4 /*yield*/, client.search({ index: 'cities.index', body: body, type: 'cities_list' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
// operator
// 注意这里， name 里面包含 "Agara 或者 Adigeni"， should 这里作为权重出现。
// 可以更改 should 的 name 与must相同 来观察权重（_score字段）
// 类似的 我们可以加入 boost属性，手动调节权重 
// bool使用的是more match is better
var bulkOperater = function () {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        query: {
                            bool: {
                                must: {
                                    match: {
                                        name: {
                                            query: "Agara Adigeni",
                                            // 默认是or ,加上是 and, 表示同时满足
                                            operator: "or"
                                        }
                                    }
                                },
                                should: [
                                    { match: { name: 'Ordino' } },
                                    { match: { name: 'Agara' } },
                                ]
                            }
                        },
                        size: 100
                    };
                    return [4 /*yield*/, client.search({ index: 'cities.index', body: body, type: 'cities_list' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
var regxpSearch = function (params) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        query: {
                            match: {
                                name: "agosta"
                            }
                        }
                    };
                    return [4 /*yield*/, client.search({ index: 'cities.index', body: body, type: 'cities_list' })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var resp2, matchAll, matchName, bulkBoll, operater, reg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.index({
                        index: 'scotch.io-tutorial',
                        id: '1',
                        type: 'first_list',
                        body: {
                            "Key1": "Content for key one",
                            "Key2": "Content for key two",
                            "key3": "Content for key three"
                        }
                    })];
                case 1:
                    resp2 = _a.sent();
                    return [4 /*yield*/, bulkMatchAll()];
                case 2:
                    matchAll = _a.sent();
                    return [4 /*yield*/, buikMatch()];
                case 3:
                    matchName = _a.sent();
                    return [4 /*yield*/, matchBool()];
                case 4:
                    bulkBoll = _a.sent();
                    return [4 /*yield*/, bulkOperater()];
                case 5:
                    operater = _a.sent();
                    return [4 /*yield*/, regxpSearch()];
                case 6:
                    reg = _a.sent();
                    console.log('matchName', reg.hits.hits);
                    return [2 /*return*/];
            }
        });
    });
}
run();
