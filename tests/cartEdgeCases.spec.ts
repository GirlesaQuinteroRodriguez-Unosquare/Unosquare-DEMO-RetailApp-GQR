import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';

// Casos de prueba para el carrito: límites, negativos y equivalencias

test.describe('Carrito de compras - Casos de borde y negativos', () => {
  test.beforeEach(async ({ page }) => {
    // Login válido
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_validUser', 'secret_uno');
  });

  test('No permite checkout con carrito vacío', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.checkoutButton).toBeDisabled();
  });

  test('No permite checkout con total negativo', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Defective Pickleball Set (CLEARANCE)');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.checkoutButton).toBeDisabled();
  });

  test('Agregar y eliminar productos, cantidad mínima y máxima', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Tennis Ball Set (3 pack)');
    await inventory.openCart();
    const cart = new CartPage(page);
    // Eliminar producto (simular cantidad 0)
    // Aquí podrías agregar métodos en CartPage para eliminar o cambiar cantidad
    // Por ahora solo verifica que el producto aparece
    await expect(cart.cartItems).toContainText('Tennis Ball Set');
  });

  test('Persistencia del carrito tras recargar la página', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Paddle Ball Set');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.cartItems).toContainText('Paddle Ball Set');
    await page.reload();
    await expect(cart.cartItems).toContainText('Paddle Ball Set');
  });
});
