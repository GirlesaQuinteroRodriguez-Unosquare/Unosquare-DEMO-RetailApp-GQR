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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
var mysql = require('mysql2/promise');
var config = {
    host: 'localhost',
    user: 'retailapp_user',
    password: 'unosquare123456789',
    database: 'QA_Automation',
    port: 3306
};
// Ruta por defecto del JSON de Playwright
var resultsPath = path.join(__dirname, 'test-results.json');
function insertResult(test, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var suiteTitle, pageObject, ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget, sqlInsert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    suiteTitle = test._suiteTitle || '';
                    pageObject = test._pageObject || '';
                    ScriptName = test.title;
                    Category = suiteTitle;
                    TestSuite = pageObject;
                    ExecutionTime = test.duration ? test.duration / 1000 : null;
                    StartTime = test.startTime ? new Date(test.startTime) : new Date();
                    EndTime = test.endTime ? new Date(test.endTime) : new Date();
                    Status = test.outcome ? capitalizeStatus(test.outcome) : '';
                    ExecutionTarget = test.file || '';
                    // Log para depuración
                    console.log({ ScriptName: ScriptName, Category: Category, TestSuite: TestSuite, ExecutionTime: ExecutionTime, StartTime: StartTime, EndTime: EndTime, Status: Status, ExecutionTarget: ExecutionTarget });
                    sqlInsert = "INSERT INTO ScriptDetails \n    (ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget)\n    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    return [4 /*yield*/, connection.execute(sqlInsert, [
                        ScriptName,
                        Category,
                        TestSuite,
                        ExecutionTime,
                        StartTime,
                        EndTime,
                        Status,
                        ExecutionTarget
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function capitalizeStatus(status) {
    if (!status)
        return '';
    if (status === 'expected')
        return 'Passed';
    if (status === 'unexpected')
        return 'Failed';
    return status.charAt(0).toUpperCase() + status.slice(1);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function collectSpecs(suite, parentTitle) {
            var _a, _b, _c, _d;
            if (parentTitle === void 0) { parentTitle = ''; }
            if (suite.specs) {
                for (var _i = 0, _e = suite.specs; _i < _e.length; _i++) {
                    var spec = _e[_i];
                    var pageObject = '';
                    if (spec.file) {
                        var match = spec.file.match(/pageObjects[\\\/]([\w-]+)\./i);
                        if (match)
                            pageObject = match[1];
                    }
                    for (var _f = 0, _g = spec.tests; _f < _g.length; _f++) {
                        var test = _g[_f];
                        var t = {
                            title: test.title || '',
                            outcome: (_a = test.results[0]) === null || _a === void 0 ? void 0 : _a.status,
                            duration: (_b = test.results[0]) === null || _b === void 0 ? void 0 : _b.duration,
                            startTime: (_c = test.results[0]) === null || _c === void 0 ? void 0 : _c.startTime,
                            endTime: (_d = test.results[0]) === null || _d === void 0 ? void 0 : _d.endTime,
                            file: spec.file
                        };
                        t._suiteTitle = parentTitle;
                        t._pageObject = pageObject;
                        tests.push(t);
                    }
                }
            }
            if (suite.suites) {
                for (var _h = 0, _j = suite.suites; _h < _j.length; _h++) {
                    var child = _j[_h];
                    collectSpecs(child, child.title || parentTitle);
                }
            }
        }
        var data, tests, _i, _a, suite, connection, _b, tests_1, test, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
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
                            collectSpecs(suite, suite.title || '');
                        }
                    }
                    console.log('Cantidad de tests encontrados:', tests.length);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 11]);
                    return [4 /*yield*/, mysql.createConnection(config)];
                case 2:
                    connection = _c.sent();
                    _b = 0, tests_1 = tests;
                    _c.label = 3;
                case 3:
                    if (!(_b < tests_1.length)) return [3 /*break*/, 6];
                    test = tests_1[_b];
                    return [4 /*yield*/, insertResult(test, connection)];
                case 4:
                    _c.sent();
                    console.log("Insertado: ".concat(test.title, " (").concat(test.outcome, ")"));
                    _c.label = 5;
                case 5:
                    _b++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 11];
                case 7:
                    err_1 = _c.sent();
                    console.error('Error:', err_1);
                    return [3 /*break*/, 11];
                case 8:
                    if (!connection) return [3 /*break*/, 10];
                    return [4 /*yield*/, connection.end()];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main();
