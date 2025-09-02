"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
// Helper para asignar tags a un test
function withTags(tags, fn) {
    fn.tags = tags;
    return fn;
}
const LoginPage_1 = require("./pageObjects/LoginPage");
const InventoryPage_1 = require("./pageObjects/InventoryPage");
// Casos de prueba para filtros y ordenamientos
test_1.test.describe('Filtros y ordenamientos de productos', () => {
    test_1.test.beforeEach(async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_validUser', 'secret_uno');
    });
    // @Priority:3
    // @Severity:2
    // @US:31
    // @SP:1
    // @PageObject:InventoryPage
    (0, test_1.test)('Filtrar por categoría inexistente muestra lista vacía', {
        annotations: [
            { type: 'US', description: '31' },
            { type: 'SP', description: '1' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'FILTER-NONE' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.categoryFilter.selectOption('nonexistent');
        await (0, test_1.expect)(inventory.inventoryContainer).not.toContainText('Tennis');
        await (0, test_1.expect)(inventory.inventoryContainer).not.toContainText('Paddle');
        await (0, test_1.expect)(inventory.inventoryContainer).not.toContainText('Pickleball');
    });
    // @Priority:3
    // @Severity:2
    // @US:32
    // @SP:1
    // @PageObject:InventoryPage
    (0, test_1.test)('Filtrar por precio menor al más barato muestra lista vacía', {
        annotations: [
            { type: 'US', description: '32' },
            { type: 'SP', description: '1' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'FILTER-PRICE-LOW' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.priceFilter.fill('1');
        await (0, test_1.expect)(inventory.inventoryContainer).not.toContainText('Tennis');
        await (0, test_1.expect)(inventory.inventoryContainer).not.toContainText('Paddle');
        await (0, test_1.expect)(inventory.inventoryContainer).not.toContainText('Pickleball');
    });
    // @Priority:4
    // @Severity:1
    // @US:33
    // @SP:1
    // @PageObject:InventoryPage
    (0, test_1.test)('Ordenar por precio ascendente', {
        annotations: [
            { type: 'US', description: '33' },
            { type: 'SP', description: '1' },
            { type: 'Severity', description: '1' },
            { type: 'testcase', description: 'SORT-PRICE-ASC' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.sortSelect.selectOption('price-asc');
        // Verifica que el primer producto sea el más barato
        const firstProduct = await inventory.inventoryContainer.locator('.inventory-item').first().textContent();
        (0, test_1.expect)(firstProduct).toContain('Tennis Ball Set'); // El más barato
    });
    // @Priority:4
    // @Severity:1
    // @US:34
    // @SP:1
    // @PageObject:InventoryPage
    (0, test_1.test)('Ordenar por nombre descendente', {
        annotations: [
            { type: 'US', description: '34' },
            { type: 'SP', description: '1' },
            { type: 'Severity', description: '1' },
            { type: 'testcase', description: 'SORT-NAME-DESC' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.sortSelect.selectOption('name-desc');
        const firstProduct = await inventory.inventoryContainer.locator('.inventory-item').first().textContent();
        (0, test_1.expect)(firstProduct).toContain('Tennis Strings Pro');
    });
});
