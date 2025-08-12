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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var fs = require('fs');
var path = require('path');
var sql = require('mssql');
var config = {
    server: 'localhost',
    database: 'QA_Automation',
    options: { trustServerCertificate: true },
    authentication: {
        type: 'ntlm',
        options: {
            domain: '',
            userName: process.env.USERNAME || '',
            password: ''
        }
    }
};
// Ruta por defecto del JSON de Playwright
var resultsPath = path.join(__dirname, 'test-results.json');
function insertResult(test, pool) {
    return __awaiter(this, void 0, void 0, function () {
        var title, outcome, duration, startTime, endTime, file, ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = test.title, outcome = test.outcome, duration = test.duration, startTime = test.startTime, endTime = test.endTime, file = test.file;
                    ScriptName = title;
                    Category = '';
                    TestSuite = file || '';
                    ExecutionTime = duration / 1000;
                    StartTime = startTime ? new Date(startTime) : new Date();
                    EndTime = endTime ? new Date(endTime) : new Date();
                    Status = outcome === 'expected' ? 'Passed' : 'Failed';
                    ExecutionTarget = '';
                    return [4 /*yield*/, pool.request()
                            .input('ScriptName', sql.NVarChar, ScriptName)
                            .input('Category', sql.NVarChar, Category)
                            .input('TestSuite', sql.NVarChar, TestSuite)
                            .input('ExecutionTime', sql.Float, ExecutionTime)
                            .input('StartTime', sql.DateTime, StartTime)
                            .input('EndTime', sql.DateTime, EndTime)
                            .input('Status', sql.NVarChar, Status)
                            .input('ExecutionTarget', sql.NVarChar, ExecutionTarget)
                            .query("INSERT INTO ScriptDetails \n      (ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget)\n      VALUES (@ScriptName, @Category, @TestSuite, @ExecutionTime, @StartTime, @EndTime, @Status, @ExecutionTarget)")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var data, tests, _i, _a, suite, _b, _c, spec, _d, _e, test, pool, _f, tests_1, test;
        var _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!fs.existsSync(resultsPath)) {
                        console.error('No se encontró el archivo de resultados:', resultsPath);
                        return [2 /*return*/];
                    }
                    data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
                    tests = [];
                    if (data.suites) {
                        for (_i = 0, _a = data.suites; _i < _a.length; _i++) {
                            suite = _a[_i];
                            for (_b = 0, _c = suite.specs; _b < _c.length; _b++) {
                                spec = _c[_b];
                                for (_d = 0, _e = spec.tests; _d < _e.length; _d++) {
                                    test = _e[_d];
                                    tests.push({
                                        title: spec.title,
                                        outcome: (_g = test.results[0]) === null || _g === void 0 ? void 0 : _g.status,
                                        duration: (_h = test.results[0]) === null || _h === void 0 ? void 0 : _h.duration,
                                        startTime: (_j = test.results[0]) === null || _j === void 0 ? void 0 : _j.startTime,
                                        endTime: (_k = test.results[0]) === null || _k === void 0 ? void 0 : _k.endTime,
                                        file: spec.file
                                    });
                                }
                            }
                        }
                    }
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, , 7, 10]);
                    return [4 /*yield*/, sql.connect(config)];
                case 2:
                    pool = _l.sent();
                    _f = 0, tests_1 = tests;
                    _l.label = 3;
                case 3:
                    if (!(_f < tests_1.length)) return [3 /*break*/, 6];
                    test = tests_1[_f];
                    return [4 /*yield*/, insertResult(test, pool)];
                case 4:
                    _l.sent();
                    console.log("Insertado: ".concat(test.title, " (").concat(test.outcome, ")"));
                    _l.label = 5;
                case 5:
                    _f++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 10];
                case 7:
                    if (!pool) return [3 /*break*/, 9];
                    return [4 /*yield*/, pool.close()];
                case 8:
                    _l.sent();
                    _l.label = 9;
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) { console.error('Error:', err); });
