// Define el tipo para los tests
interface PlaywrightTestResult {
  title: string;
  outcome: string;
  duration: number;
  startTime: string | number | Date;
  endTime: string | number | Date;
  file: string;
}

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  user: 'retailapp_user',
  password: 'unosquare123456789',
  database: 'QA_Automation',
  port: 3306
};

// Ruta por defecto del JSON de Playwright
const resultsPath = path.join(__dirname, 'test-results.json');


async function insertResult(test: PlaywrightTestResult, connection: any) {
  const suiteTitle = (test as any)._suiteTitle || '';
  const pageObject = (test as any)._pageObject || '';

  const ScriptName = test.title;
  const Category = suiteTitle;
  const TestSuite = pageObject;
  const ExecutionTime = test.duration ? test.duration / 1000 : null;
  const StartTime = test.startTime ? new Date(test.startTime) : new Date();
  const EndTime = test.endTime ? new Date(test.endTime) : new Date();
  const Status = test.outcome ? capitalizeStatus(test.outcome) : '';
  const ExecutionTarget = test.file || '';

  // Log para depuración
  console.log({ ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget });

  const sqlInsert = `INSERT INTO ScriptDetails 
    (ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  await connection.execute(sqlInsert, [
    ScriptName,
    Category,
    TestSuite,
    ExecutionTime,
    StartTime,
    EndTime,
    Status,
    ExecutionTarget
  ]);
}

function capitalizeStatus(status) {
  if (!status) return '';
  if (status === 'expected') return 'Passed';
  if (status === 'unexpected') return 'Failed';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

async function main() {
  if (!fs.existsSync(resultsPath)) {
    console.error('No se encontró el archivo de resultados:', resultsPath);
    return;
  }
  const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  // Playwright JSON reporter: data.suites[].specs[].tests[]
  const tests: PlaywrightTestResult[] = [];
  function collectSpecs(suite, parentTitle = '') {
    if (suite.specs) {
      for (const spec of suite.specs) {
        let pageObject = '';
        if (spec.file) {
          const match = spec.file.match(/pageObjects[\\\/]([\w-]+)\./i);
          if (match) pageObject = match[1];
        }
        for (const test of spec.tests) {
          const t: PlaywrightTestResult = {
            title: test.title || '',
            outcome: test.results[0]?.status,
            duration: test.results[0]?.duration,
            startTime: test.results[0]?.startTime,
            endTime: test.results[0]?.endTime,
            file: spec.file
          };
          (t as any)._suiteTitle = parentTitle;
          (t as any)._pageObject = pageObject;
          tests.push(t);
        }
      }
    }
    if (suite.suites) {
      for (const child of suite.suites) {
        collectSpecs(child, child.title || parentTitle);
      }
    }
  }
  if (data.suites) {
    for (const suite of data.suites) {
      collectSpecs(suite, suite.title || '');
    }
  }
  console.log('Cantidad de tests encontrados:', tests.length);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    for (const test of tests) {
      await insertResult(test, connection);
      console.log(`Insertado: ${test.title} (${test.outcome})`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (connection) await connection.end();
  }
}

main();
