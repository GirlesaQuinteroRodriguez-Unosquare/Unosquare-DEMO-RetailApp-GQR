"use strict";
// -------------------------------------------------------------
// Script para insertar resultados de pruebas Playwright en MySQL
// -------------------------------------------------------------
// Lee el archivo test-results.json generado por Playwright,
// recorre todas las suites/specs/tests (incluso anidadas),
// y guarda los resultados en la tabla ScriptDetails.
//
// Estructura esperada de test-results.json:
// {
//   suites: [
//     { title, suites: [...], specs: [ { file, tests: [ { title, results: [ { status, duration, startTime, endTime } ] } ] } ] }
//   ]
// }
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
// Configuración de conexión a MySQL
const config = {
    host: 'localhost',
    user: 'retailapp_user',
    password: 'unosquare123456789',
    database: 'QA_Automation',
    port: 3306
};
// Ruta del JSON generado por el custom reporter
const resultsPath = path.join(__dirname, 'test-results-with-tags.json');
// Inserta un resultado individual en la base de datos ScriptDetailsWithTags
async function insertResult(test, connection) {
    // Mapea los campos para la tabla ScriptDetailsWithTags
    const ScriptName = test.title;
    const Category = '';
    const TestSuite = '';
    const ExecutionTime = test.duration ? test.duration / 1000 : null;
    const StartTime = test.startTime ? new Date(test.startTime) : new Date();
    const EndTime = test.endTime ? new Date(test.endTime) : new Date();
    const Status = test.outcome ? capitalizeStatus(test.outcome) : '';
    const ExecutionTarget = test.file || '';
    const US = test.tags?.US || null;
    const SP = test.tags?.SP || null;
    const Severity = test.tags?.Severity || null;
    const testcase = test.tags?.testcase || null;
    const RunName = test.runName || '';
    // Log para depuración
    console.log({ ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget, US, SP, Severity, testcase, RunName });
    // Inserta el registro en la base de datos
    const sqlInsert = `INSERT INTO ScriptDetailsWithTags 
    (ScriptName, Category, TestSuite, ExecutionTime, StartTime, EndTime, Status, ExecutionTarget, US, SP, Severity, testcase, RunName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await connection.execute(sqlInsert, [
        ScriptName,
        Category,
        TestSuite,
        ExecutionTime,
        StartTime,
        EndTime,
        Status,
        ExecutionTarget,
        US,
        SP,
        Severity,
        testcase,
        RunName
    ]);
}
// Convierte el status de Playwright a formato legible para la base de datos
function capitalizeStatus(status) {
    if (!status)
        return '';
    if (status === 'expected')
        return 'Passed';
    if (status === 'unexpected')
        return 'Failed';
    return status.charAt(0).toUpperCase() + status.slice(1);
}
// Función principal: lee el JSON, extrae los tests y los inserta en la base de datos
async function main() {
    if (!fs.existsSync(resultsPath)) {
        console.error('No se encontró el archivo de resultados:', resultsPath);
        return;
    }
    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    // El custom reporter genera un array plano: { tests: [ ... ] }
    const tests = data.tests || [];
    console.log('Cantidad de tests encontrados:', tests.length);
    // Inserta todos los tests en la base de datos
    let connection;
    try {
        connection = await mysql.createConnection(config);
        for (const test of tests) {
            await insertResult(test, connection);
            console.log(`Insertado: ${test.title} (${test.outcome})`);
        }
    }
    catch (err) {
        console.error('Error:', err);
    }
    finally {
        if (connection)
            await connection.end();
    }
}
main();
