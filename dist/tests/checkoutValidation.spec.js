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
const CheckoutPage_1 = require("./pageObjects/CheckoutPage");
// Casos negativos y límites para checkout
test_1.test.describe('Validaciones de Checkout', () => {
    test_1.test.beforeEach(async ({ page }) => {
        // Login válido y agregar producto
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_validUser', 'secret_uno');
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Professional Tennis Racket');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await cart.proceedToCheckout();
    });
    // @Priority:1
    // @Severity:4
    // @US:21
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('Zip code inválido', {
        annotations: [
            { type: 'US', description: '21' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '4' },
            { type: 'testcase', description: 'CHK-ZIP' }
        ]
    }, async ({ page }) => {
        const checkout = new CheckoutPage_1.CheckoutPage(page);
        await checkout.fillCheckoutForm({
            firstName: 'Test',
            lastName: 'User',
            zipCode: '12', // Inválido
            streetAddress: 'Calle 1',
            city: 'Ciudad',
            state: 'ST',
            paymentType: 'credit',
            cardNumber: '1234567812345678',
            expiryDate: '12/30',
            cvv: '123'
        });
        await checkout.submit();
        await (0, test_1.expect)(checkout.errorBanner).toBeVisible();
        await (0, test_1.expect)(checkout.errorBanner).toHaveText(/zip code/);
    });
    // @Priority:2
    // @Severity:4
    // @US:22
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('Card number inválido', {
        annotations: [
            { type: 'US', description: '22' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '4' },
            { type: 'testcase', description: 'CHK-CARD' }
        ]
    }, async ({ page }) => {
        const checkout = new CheckoutPage_1.CheckoutPage(page);
        await checkout.fillCheckoutForm({
            firstName: 'Test',
            lastName: 'User',
            zipCode: '12345',
            streetAddress: 'Calle 1',
            city: 'Ciudad',
            state: 'ST',
            paymentType: 'credit',
            cardNumber: '1234', // Inválido
            expiryDate: '12/30',
            cvv: '123'
        });
        await checkout.submit();
        await (0, test_1.expect)(checkout.errorBanner).toBeVisible();
        await (0, test_1.expect)(checkout.errorBanner).toHaveText(/16-digit card number/);
    });
    // @Priority:3
    // @Severity:3
    // @US:23
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('Expiry date inválida', {
        annotations: [
            { type: 'US', description: '23' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'CHK-EXP' }
        ]
    }, async ({ page }) => {
        const checkout = new CheckoutPage_1.CheckoutPage(page);
        await checkout.fillCheckoutForm({
            firstName: 'Test',
            lastName: 'User',
            zipCode: '12345',
            streetAddress: 'Calle 1',
            city: 'Ciudad',
            state: 'ST',
            paymentType: 'credit',
            cardNumber: '1234567812345678',
            expiryDate: '01/20', // Fecha pasada
            cvv: '123'
        });
        await checkout.submit();
        await (0, test_1.expect)(checkout.errorBanner).toBeVisible();
        await (0, test_1.expect)(checkout.errorBanner).toHaveText(/expiry date/);
    });
    // @Priority:3
    // @Severity:3
    // @US:24
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('CVV inválido', {
        annotations: [
            { type: 'US', description: '24' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'CHK-CVV' }
        ]
    }, async ({ page }) => {
        const checkout = new CheckoutPage_1.CheckoutPage(page);
        await checkout.fillCheckoutForm({
            firstName: 'Test',
            lastName: 'User',
            zipCode: '12345',
            streetAddress: 'Calle 1',
            city: 'Ciudad',
            state: 'ST',
            paymentType: 'credit',
            cardNumber: '1234567812345678',
            expiryDate: '12/30',
            cvv: '1' // Inválido
        });
        await checkout.submit();
        await (0, test_1.expect)(checkout.errorBanner).toBeVisible();
        await (0, test_1.expect)(checkout.errorBanner).toHaveText(/CVV/);
    });
});
