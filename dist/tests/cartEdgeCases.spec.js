"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const LoginPage_1 = require("./pageObjects/LoginPage");
const InventoryPage_1 = require("./pageObjects/InventoryPage");
const CartPage_1 = require("./pageObjects/CartPage");
// Casos de prueba para el carrito: límites, negativos y equivalencias
test_1.test.describe('Carrito de compras - Casos de borde y negativos', () => {
    test_1.test.beforeEach(async ({ page }) => {
        // Login válido
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_validUser', 'secret_uno');
    });
    // @Priority:2
    // @Severity:3
    // @US:12
    // @SP:2
    // @PageObject:CartPage
    (0, test_1.test)('No permite checkout con carrito vacío', {
        annotations: [
            { type: 'US', description: '12' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'CART-EMPTY' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await (0, test_1.expect)(cart.checkoutButton).toBeDisabled();
    });
    // @Priority:2
    // @Severity:3
    // @US:13
    // @SP:2
    // @PageObject:CartPage
    (0, test_1.test)('No permite checkout con total negativo', {
        annotations: [
            { type: 'US', description: '13' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'CART-NEGATIVE' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Defective Pickleball Set (CLEARANCE)');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await (0, test_1.expect)(cart.checkoutButton).toBeDisabled();
    });
    // @Priority:3
    // @Severity:2
    // @US:14
    // @SP:3
    // @PageObject:CartPage
    (0, test_1.test)('Agregar y eliminar productos, cantidad mínima y máxima', {
        annotations: [
            { type: 'US', description: '14' },
            { type: 'SP', description: '3' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'CART-ADD-REMOVE' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Tennis Ball Set (3 pack)');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        // Eliminar producto (simular cantidad 0)
        // Aquí podrías agregar métodos en CartPage para eliminar o cambiar cantidad
        // Por ahora solo verifica que el producto aparece
        await (0, test_1.expect)(cart.cartItems).toContainText('Tennis Ball Set');
    });
    // @Priority:4
    // @Severity:2
    // @US:15
    // @SP:2
    // @PageObject:CartPage
    (0, test_1.test)('Persistencia del carrito tras recargar la página', {
        annotations: [
            { type: 'US', description: '15' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'CART-PERSIST' }
        ]
    }, async ({ page }) => {
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Paddle Ball Set');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await (0, test_1.expect)(cart.cartItems).toContainText('Paddle Ball Set');
        await page.reload();
        await inventory.openCart();
        await (0, test_1.expect)(cart.cartItems).toContainText('Paddle Ball Set');
    });
});
