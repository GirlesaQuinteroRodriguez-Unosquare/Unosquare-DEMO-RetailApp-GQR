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
// Casos de prueba para guest checkout y validaciones de email
test_1.test.describe('Guest Checkout', () => {
    test_1.test.beforeEach(async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.continueAsGuest();
        const inventory = new InventoryPage_1.InventoryPage(page);
        await inventory.addProductToCartByName('Pickleball Paddle Set');
        await inventory.openCart();
        const cart = new CartPage_1.CartPage(page);
        await cart.proceedToCheckout();
    });
    // @Priority:2
    // @Severity:3
    // @US:41
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('No permite continuar con email inválido', {
        annotations: [
            { type: 'US', description: '41' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'GUEST-EMAIL-INVALID' }
        ]
    }, async ({ page }) => {
        const checkout = new CheckoutPage_1.CheckoutPage(page);
        await checkout.fillCheckoutForm({
            email: 'correo_invalido',
            firstName: 'Guest',
            lastName: 'User',
            zipCode: '12345',
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
        await (0, test_1.expect)(checkout.errorBanner).toHaveText(/email/);
    });
    // @Priority:3
    // @Severity:2
    // @US:42
    // @SP:2
    // @PageObject:CheckoutPage
    (0, test_1.test)('Permite continuar con email válido', {
        annotations: [
            { type: 'US', description: '42' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'GUEST-EMAIL-VALID' }
        ]
    }, async ({ page }) => {
        const checkout = new CheckoutPage_1.CheckoutPage(page);
        await checkout.fillCheckoutForm({
            email: 'guest@correo.com',
            firstName: 'Guest',
            lastName: 'User',
            zipCode: '12345',
            streetAddress: 'Calle 1',
            city: 'Ciudad',
            state: 'ST',
            paymentType: 'credit',
            cardNumber: '1234567812345678',
            expiryDate: '12/30',
            cvv: '123'
        });
        await checkout.submit();
        // No debe mostrar error
        await (0, test_1.expect)(checkout.errorBanner).toBeHidden();
    });
});
