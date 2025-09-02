"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class CustomJsonReporter {
    results = [];
    runName = '';
    onBegin(config, suite) {
        // Lee el nombre de la corrida desde variable de entorno o argumento
        this.runName = process.env.PW_RUN_NAME || '';
    }
    onTestEnd(test, result) {
        // Extrae los tags directamente de las anotaciones del test
        let tags = {};
        if (test.annotations && test.annotations.length > 0) {
            for (const ann of test.annotations) {
                if (ann.type && ann.description) {
                    tags[ann.type] = ann.description;
                }
            }
        }
        this.results.push({
            title: test.title,
            file: test.location.file,
            outcome: result.status,
            duration: result.duration,
            startTime: result.startTime,
            // endTime no existe en TestResult, así que lo calculamos
            endTime: result.startTime ? new Date(result.startTime).getTime() + result.duration : undefined,
            tags,
            runName: this.runName
        });
    }
    onEnd() {
        fs_1.default.writeFileSync('test-results-with-tags.json', JSON.stringify({ tests: this.results }, null, 2));
    }
}
exports.default = CustomJsonReporter;
