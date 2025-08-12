import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';
import { CheckoutPage } from './pageObjects/CheckoutPage';

// Casos negativos y límites para checkout

test.describe('Validaciones de Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Login válido y agregar producto
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.login('unosquare_validUser', 'secret_uno');
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Professional Tennis Racket');
    await inventory.openCart();
    const cart = new CartPage(page);
    await cart.proceedToCheckout();
  });

  // @Priority:1
  // @Severity:4
  // @US:21
  // @SP:2
  // @PageObject:CheckoutPage
  test('Zip code inválido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
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
    await expect(checkout.errorBanner).toBeVisible();
    await expect(checkout.errorBanner).toHaveText(/zip code/);
  });

  // @Priority:2
  // @Severity:4
  // @US:22
  // @SP:2
  // @PageObject:CheckoutPage
  test('Card number inválido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
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
    await expect(checkout.errorBanner).toBeVisible();
    await expect(checkout.errorBanner).toHaveText(/16-digit card number/);
  });

  // @Priority:3
  // @Severity:3
  // @US:23
  // @SP:2
  // @PageObject:CheckoutPage
  test('Expiry date inválida', async ({ page }) => {
    const checkout = new CheckoutPage(page);
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
    await expect(checkout.errorBanner).toBeVisible();
    await expect(checkout.errorBanner).toHaveText(/expiry date/);
  });

  // @Priority:3
  // @Severity:3
  // @US:24
  // @SP:2
  // @PageObject:CheckoutPage
  test('CVV inválido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
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
    await expect(checkout.errorBanner).toBeVisible();
    await expect(checkout.errorBanner).toHaveText(/CVV/);
  });
});
