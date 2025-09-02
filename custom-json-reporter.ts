// Custom Playwright Reporter para incluir tags y runName en el JSON de resultados
import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import fs from 'fs';

class CustomJsonReporter implements Reporter {
  private results: any[] = [];
  private runName: string = '';

  onBegin(config: any, suite: any) {
    // Lee el nombre de la corrida desde variable de entorno o argumento
    this.runName = process.env.PW_RUN_NAME || '';
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Extrae los tags desde múltiples fuentes posibles
    let tags: Record<string, any> = {};
    
    // 1. Intenta desde result.annotations (dinámicas)
    if (result.annotations && Array.isArray(result.annotations) && result.annotations.length > 0) {
      for (const ann of result.annotations) {
        if (ann.type && ann.description) {
          tags[ann.type] = ann.description;
        }
      }
    }

    // 2. Si no hay tags, intenta desde test.annotations (estáticas)
    if (Object.keys(tags).length === 0 && test.annotations && Array.isArray(test.annotations)) {
      for (const ann of test.annotations) {
        if (ann.type && ann.description) {
          tags[ann.type] = ann.description;
        }
      }
    }

    // 3. Si aún no hay tags, extrae desde el código fuente como fallback
    if (Object.keys(tags).length === 0) {
      tags = this.extractTagsFromSourceCode(test.location.file, test.title);
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

  // Extrae tags directamente del código fuente del test
  private extractTagsFromSourceCode(filePath: string, testTitle: string): Record<string, any> {
    try {
      const sourceCode = fs.readFileSync(filePath, 'utf8');
      const lines = sourceCode.split('\n');
      
      // Busca el test por su título
      let testStartLine = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`test('${testTitle}'`) || lines[i].includes(`test("${testTitle}"`)) {
          testStartLine = i;
          break;
        }
      }

      if (testStartLine === -1) return {};

      // Busca las líneas con testInfo.annotations.push dentro del test
      let braceCount = 0;
      let foundOpenBrace = false;
      const tags: Record<string, any> = {};

      for (let i = testStartLine; i < lines.length; i++) {
        const line = lines[i];
        
        // Cuenta las llaves para saber cuándo termina el test
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
          if (braceCount > 0) foundOpenBrace = true;
        }

        // Si encontramos testInfo.annotations.push
        if (line.includes('testInfo.annotations.push')) {
          // Busca las líneas siguientes que contienen los tags
          for (let j = i + 1; j < lines.length && j < i + 10; j++) {
            const tagLine = lines[j].trim();
            const match = tagLine.match(/{\s*type:\s*['"](\w+)['"],\s*description:\s*['"]([^'"]+)['"]\s*}/);
            if (match) {
              tags[match[1]] = match[2];
            }
            if (tagLine.includes(');')) break; // Fin del push
          }
          break;
        }

        // Si terminó el test y no encontramos tags, sal del loop
        if (foundOpenBrace && braceCount === 0) break;
      }

      return tags;
    } catch (error) {
      console.warn(`Error leyendo tags del archivo ${filePath}:`, error);
      return {};
    }
  }

  onEnd() {
    fs.writeFileSync('test-results-with-tags.json', JSON.stringify({ tests: this.results }, null, 2));
  }
}

export default CustomJsonReporter;
