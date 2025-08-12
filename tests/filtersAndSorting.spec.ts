import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';

// Casos de prueba para filtros y ordenamientos

test.describe('Filtros y ordenamientos de productos', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_validUser', 'secret_uno');
  });

  // @Priority:3
  // @Severity:2
  // @US:31
  // @SP:1
  // @PageObject:InventoryPage
  test('Filtrar por categoría inexistente muestra lista vacía', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.categoryFilter.selectOption('nonexistent');
    await expect(inventory.inventoryContainer).not.toContainText('Tennis');
    await expect(inventory.inventoryContainer).not.toContainText('Paddle');
    await expect(inventory.inventoryContainer).not.toContainText('Pickleball');
  });

  // @Priority:3
  // @Severity:2
  // @US:32
  // @SP:1
  // @PageObject:InventoryPage
  test('Filtrar por precio menor al más barato muestra lista vacía', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.priceFilter.fill('1');
    await expect(inventory.inventoryContainer).not.toContainText('Tennis');
    await expect(inventory.inventoryContainer).not.toContainText('Paddle');
    await expect(inventory.inventoryContainer).not.toContainText('Pickleball');
  });

  // @Priority:4
  // @Severity:1
  // @US:33
  // @SP:1
  // @PageObject:InventoryPage
  test('Ordenar por precio ascendente', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortSelect.selectOption('price-asc');
    // Verifica que el primer producto sea el más barato
    const firstProduct = await inventory.inventoryContainer.locator('.inventory-item').first().textContent();
    expect(firstProduct).toContain('Tennis Ball Set'); // El más barato
  });

  // @Priority:4
  // @Severity:1
  // @US:34
  // @SP:1
  // @PageObject:InventoryPage
  test('Ordenar por nombre descendente', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortSelect.selectOption('name-desc');
    const firstProduct = await inventory.inventoryContainer.locator('.inventory-item').first().textContent();
    expect(firstProduct).toContain('Tennis Strings Pro');
  });
});
