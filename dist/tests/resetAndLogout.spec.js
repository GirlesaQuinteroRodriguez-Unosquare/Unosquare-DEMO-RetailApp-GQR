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
const CartPage_1 = require("./pageObjects/CartPage");
// Casos de prueba para reset y logout
test_1.test.describe('Reset App y Logout', () => {
    // @Priority:2
    // @Severity:3
    // @US:51
    // @SP:2
    // @PageObject:CartPage
    (0, test_1.test)('Reset App limpia el carrito y regresa a inventario', {
        annotations: [
            { type: 'US', description: '51' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'RESET-CART' }
        ]
    }, async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_validUser', 'secret_uno');
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Tennis Ball Set (3 pack)');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await (0, test_1.expect)(cart.cartItems).toContainText('Tennis Ball Set');
        // Click en el menú y luego en reset
        await page.locator('#menu-btn').click();
        await page.locator('#reset-app').click();
        // Espera a que regrese a inventario
        await (0, test_1.expect)(page.locator('#inventory-page')).toBeVisible();
        await inventory.openCart();
        await (0, test_1.expect)(cart.cartItems).not.toContainText('Tennis Ball Set');
    });
    // @Priority:2
    // @Severity:3
    // @US:52
    // @SP:2
    // @PageObject:CartPage
    (0, test_1.test)('Logout limpia usuario y carrito', {
        annotations: [
            { type: 'US', description: '52' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'LOGOUT-CART' }
        ]
    }, async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_validUser', 'secret_uno');
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Paddle Ball Set');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await (0, test_1.expect)(cart.cartItems).toContainText('Paddle Ball Set');
        // Logout desde header
        await page.locator('#logout-btn').click();
        await (0, test_1.expect)(page.locator('#login-screen')).toBeVisible();
        // Login de nuevo y verifica carrito vacío
        await login.login('unosquare_validUser', 'secret_uno');
        await inventory.openCart();
        await (0, test_1.expect)(cart.cartItems).not.toContainText('Paddle Ball Set');
    });
});
