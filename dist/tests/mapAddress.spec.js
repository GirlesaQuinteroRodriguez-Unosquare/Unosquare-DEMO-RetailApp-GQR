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
// Casos de prueba para selección de dirección en el mapa
test_1.test.describe('Selección de dirección en el mapa', () => {
    test_1.test.beforeEach(async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_validUser', 'secret_uno');
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Pickleball Net System');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await cart.proceedToCheckout();
    });
    // @Priority:3
    // @Severity:2
    // @US:61
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('No selecciona coordenadas si no se hace click en el mapa', {
        annotations: [
            { type: 'US', description: '61' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'MAP-NO-CLICK' }
        ]
    }, async ({ page }) => {
        // No interactúa con el mapa
        await (0, test_1.expect)(page.locator('#selected-coordinates')).toBeHidden();
    });
    // @Priority:3
    // @Severity:2
    // @US:62
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('Selecciona coordenadas al hacer click en el mapa', {
        annotations: [
            { type: 'US', description: '62' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'MAP-CLICK' }
        ]
    }, async ({ page }) => {
        // Espera a que el mapa esté visible
        await (0, test_1.expect)(page.locator('#address-map')).toBeVisible();
        // Simula click en el centro del mapa
        const map = page.locator('#address-map');
        const box = await map.boundingBox();
        if (box) {
            await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
            await (0, test_1.expect)(page.locator('#selected-coordinates')).toBeVisible();
            await (0, test_1.expect)(page.locator('#coord-display')).not.toHaveText('Not selected');
        }
    });
});
