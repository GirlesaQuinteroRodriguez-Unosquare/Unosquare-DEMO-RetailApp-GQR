import { test, expect } from '@playwright/test';

import { LoginPage } from './pageObjects/LoginPage';

// Casos negativos y límites para login

test.describe('Login Negativo', () => {
  // @Priority:1
  // @Severity:4
  // @US:1
  // @SP:1
  // @PageObject:LoginPage
  test('Usuario y contraseña incorrectos', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '1' },
      { type: 'SP', description: '1' },
      { type: 'Severity', description: '4' },
      { type: 'testcase', description: 'LOGIN-FAIL' }
    );
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('usuario_invalido', 'clave_invalida');
    await expect(login.errorBanner).toBeVisible();
    await expect(login.errorBanner).toHaveText(/Username and password do not match/);
  });

  // @Priority:2
  // @Severity:3
  // @US:2
  // @SP:1
  // @PageObject:LoginPage
  test('Campos vacíos', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '2' },
      { type: 'SP', description: '1' },
      { type: 'Severity', description: '3' },
      { type: 'testcase', description: 'LOGIN-EMPTY' }
    );
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('', '');
    await expect(login.errorBanner).toBeVisible();
  });

  // @Priority:3
  // @Severity:2
  // @US:3
  // @SP:2
  // @PageObject:LoginPage
  test('Usuario errorUser muestra error especial', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '3' },
      { type: 'SP', description: '2' },
      { type: 'Severity', description: '2' },
      { type: 'testcase', description: 'LOGIN-EPIC' }
    );
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_errorUser', 'secret_uno');
    await expect(login.errorBanner).toBeVisible();
    await expect(login.errorBanner).toHaveText(/Epic Error/);
  });

  // @Priority:4
  // @Severity:2
  // @US:4
  // @SP:2
  // @PageObject:LoginPage
  test('Usuario performanceUser muestra loading', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '4' },
      { type: 'SP', description: '2' },
      { type: 'Severity', description: '2' },
      { type: 'testcase', description: 'LOGIN-LOAD' }
    );
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_performanceUser', 'secret_uno');
    await expect(page.locator('#loading-overlay')).toBeVisible();
    // Espera a que desaparezca el loading
    await expect(page.locator('#loading-overlay')).toBeHidden({ timeout: 12000 });
  });
});
