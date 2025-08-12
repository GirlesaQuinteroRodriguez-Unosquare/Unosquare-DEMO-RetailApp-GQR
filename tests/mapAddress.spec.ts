import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';
import { CheckoutPage } from './pageObjects/CheckoutPage';

// Casos de prueba para selección de dirección en el mapa

test.describe('Selección de dirección en el mapa', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_validUser', 'secret_uno');
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Pickleball Net System');
    await inventory.openCart();
    const cart = new CartPage(page);
    await cart.proceedToCheckout();
  });

  // @Priority:3
  // @Severity:2
  // @US:61
  // @SP:2
  // @PageObject:CheckoutPage
  test('No selecciona coordenadas si no se hace click en el mapa', async ({ page }) => {
    // No interactúa con el mapa
    await expect(page.locator('#selected-coordinates')).toBeHidden();
  });

  // @Priority:3
  // @Severity:2
  // @US:62
  // @SP:2
  // @PageObject:CheckoutPage
  test('Selecciona coordenadas al hacer click en el mapa', async ({ page }) => {
    // Espera a que el mapa esté visible
    await expect(page.locator('#address-map')).toBeVisible();
    // Simula click en el centro del mapa
    const map = page.locator('#address-map');
    const box = await map.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await expect(page.locator('#selected-coordinates')).toBeVisible();
      await expect(page.locator('#coord-display')).not.toHaveText('Not selected');
    }
  });
});
