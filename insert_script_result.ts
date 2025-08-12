import sql from 'mssql';

const config = {
  server: 'localhost', // Cambia a 'localhost\\SQLEXPRESS' si usas Express
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

interface ScriptResult {
  ScriptName: string;
  Category: string;
  TestSuite: string;
  ExecutionTime: number;
  StartTime: Date;
  EndTime: Date;
  Status: string;
  ExecutionTarget: string;
}

async function insertScriptResult({
  ScriptName,
  Category,
  TestSuite,
  ExecutionTime,
  StartTime,
  EndTime,
  Status,
  ExecutionTarget
}: ScriptResult) {
  try {
    let pool = await sql.connect(config);
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
    console.log('Resultado insertado correctamente');
    sql.close();
  } catch (err) {
    console.error('Error al insertar:', err);
    sql.close();
  }
}

// Ejemplo de uso:
insertScriptResult({
  ScriptName: 'LoginTest',
  Category: 'Regression',
  TestSuite: 'SmokeSuite',
  ExecutionTime: 2.5,
  StartTime: new Date(),
  EndTime: new Date(),
  Status: 'Passed',
  ExecutionTarget: 'Release1'
});
