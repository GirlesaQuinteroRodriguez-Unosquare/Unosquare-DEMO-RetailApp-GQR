import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';

// Casos negativos y límites para login

test.describe('Login Negativo', () => {
  test('Usuario y contraseña incorrectos', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('usuario_invalido', 'clave_invalida');
    await expect(login.errorBanner).toBeVisible();
    await expect(login.errorBanner).toHaveText(/Username and password do not match/);
  });

  test('Campos vacíos', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('', '');
    await expect(login.errorBanner).toBeVisible();
  });

  test('Usuario errorUser muestra error especial', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_errorUser', 'secret_uno');
    await expect(login.errorBanner).toBeVisible();
    await expect(login.errorBanner).toHaveText(/Epic Error/);
  });

  test('Usuario performanceUser muestra loading', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_performanceUser', 'secret_uno');
    await expect(page.locator('#loading-overlay')).toBeVisible();
    // Espera a que desaparezca el loading
    await expect(page.locator('#loading-overlay')).toBeHidden({ timeout: 12000 });
  });
});
