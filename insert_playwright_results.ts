const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const config = {
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
const resultsPath = path.join(__dirname, 'test-results.json');

async function insertResult(test: any, pool: any) {
  const { title, outcome, duration, startTime, endTime, file } = test;
  // Puedes adaptar estos campos según tu estructura
  const ScriptName = title;
  const Category = '';
  const TestSuite = file || '';
  const ExecutionTime = duration / 1000; // ms a segundos
  const StartTime = startTime ? new Date(startTime) : new Date();
  const EndTime = endTime ? new Date(endTime) : new Date();
  const Status = outcome === 'expected' ? 'Passed' : 'Failed';
  const ExecutionTarget = '';

  await pool.request()
    .input('ScriptName', sql.NVarChar, ScriptName)
    .input('Category', sql.NVarChar, Category)
    .input('TestSuite', sql.NVarChar, TestSuite)
    .input('ExecutionTime', sql.Float, ExecutionTime)
    .input('StartTime', sql.DateTime, StartTime)
    .input('EndTime', sql.DateTime, EndTime)
    .input('Status', sql.NVarChar, Status)
    .input('ExecutionTarget', sql.NVarChar, ExecutionTarget)
    .query(`INSERT INTO ScriptDetails 
      (ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget)
      VALUES (@ScriptName, @Category, @TestSuite, @ExecutionTime, @StartTime, @EndTime, @Status, @ExecutionTarget)`);
}


async function main() {
  if (!fs.existsSync(resultsPath)) {
    console.error('No se encontró el archivo de resultados:', resultsPath);
    return;
  }
  const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  // Playwright JSON reporter: data.suites[].specs[].tests[]
  const tests: any[] = [];
  if (data.suites) {
    for (const suite of data.suites) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          tests.push({
            title: spec.title,
            outcome: test.results[0]?.status,
            duration: test.results[0]?.duration,
            startTime: test.results[0]?.startTime,
            endTime: test.results[0]?.endTime,
            file: spec.file
          });
        }
      }
    }
  }
  let pool: any;
  try {
    pool = await sql.connect(config);
    for (const test of tests) {
      await insertResult(test, pool);
      console.log(`Insertado: ${test.title} (${test.outcome})`);
    }
  } finally {
    if (pool) await pool.close();
  }
}

main().catch(err => { console.error('Error:', err); });
