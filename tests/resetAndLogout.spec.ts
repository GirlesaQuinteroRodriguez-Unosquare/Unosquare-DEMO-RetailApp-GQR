import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';

// Casos de prueba para reset y logout

test.describe('Reset App y Logout', () => {
  test('Reset App limpia el carrito y regresa a inventario', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_validUser', 'secret_uno');
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Tennis Ball Set (3 pack)');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.cartItems).toContainText('Tennis Ball Set');
    // Click en el menú y luego en reset
    await page.locator('#menu-btn').click();
    await page.locator('#reset-app').click();
    // Espera a que regrese a inventario
    await expect(page.locator('#inventory-page')).toBeVisible();
    await inventory.openCart();
    await expect(cart.cartItems).not.toContainText('Tennis Ball Set');
  });

  test('Logout limpia usuario y carrito', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_validUser', 'secret_uno');
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Paddle Ball Set');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.cartItems).toContainText('Paddle Ball Set');
    // Logout desde header
    await page.locator('#logout-btn').click();
    await expect(page.locator('#login-screen')).toBeVisible();
    // Login de nuevo y verifica carrito vacío
    await login.login('unosquare_validUser', 'secret_uno');
    await inventory.openCart();
    await expect(cart.cartItems).not.toContainText('Paddle Ball Set');
  });
});
