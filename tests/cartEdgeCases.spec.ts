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

  // @Priority:2
  // @Severity:3
  // @US:12
  // @SP:2
  // @PageObject:CartPage
  test('No permite checkout con carrito vacío', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '12' },
      { type: 'SP', description: '2' },
      { type: 'Severity', description: '3' },
      { type: 'testcase', description: 'CART-EMPTY' }
    );
    const inventory = new InventoryPage(page);
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.checkoutButton).toBeDisabled();
  });

  // @Priority:2
  // @Severity:3
  // @US:13
  // @SP:2
  // @PageObject:CartPage
  test('No permite checkout con total negativo', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '13' },
      { type: 'SP', description: '2' },
      { type: 'Severity', description: '3' },
      { type: 'testcase', description: 'CART-NEGATIVE' }
    );
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Defective Pickleball Set (CLEARANCE)');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.checkoutButton).toBeDisabled();
  });

  // @Priority:3
  // @Severity:2
  // @US:14
  // @SP:3
  // @PageObject:CartPage
  test('Agregar y eliminar productos, cantidad mínima y máxima', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '14' },
      { type: 'SP', description: '3' },
      { type: 'Severity', description: '2' },
      { type: 'testcase', description: 'CART-ADD-REMOVE' }
    );
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Tennis Ball Set (3 pack)');
    await inventory.openCart();
    const cart = new CartPage(page);
    // Eliminar producto (simular cantidad 0)
    // Aquí podrías agregar métodos en CartPage para eliminar o cambiar cantidad
    // Por ahora solo verifica que el producto aparece
    await expect(cart.cartItems).toContainText('Tennis Ball Set');
  });

  // @Priority:4
  // @Severity:2
  // @US:15
  // @SP:2
  // @PageObject:CartPage
  test('Persistencia del carrito tras recargar la página', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'US', description: '15' },
      { type: 'SP', description: '2' },
      { type: 'Severity', description: '2' },
      { type: 'testcase', description: 'CART-PERSIST' }
    );
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Paddle Ball Set');
    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.cartItems).toContainText('Paddle Ball Set');
    await page.reload();
    await inventory.openCart();
    await expect(cart.cartItems).toContainText('Paddle Ball Set');
  });
});
