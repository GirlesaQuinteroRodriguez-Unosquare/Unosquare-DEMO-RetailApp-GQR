import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';
import { CheckoutPage } from './pageObjects/CheckoutPage';

// Casos de prueba para guest checkout y validaciones de email

test.describe('Guest Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto('http://localhost:5500');
    await login.continueAsGuest();
    const inventory = new InventoryPage(page);
    await inventory.addProductToCartByName('Pickleball Paddle Set');
    await inventory.openCart();
    const cart = new CartPage(page);
    await cart.proceedToCheckout();
  });

  // @Priority:2
  // @Severity:3
  // @US:41
  // @SP:2
  // @PageObject:CheckoutPage
  test('No permite continuar con email inválido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
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
    await expect(checkout.errorBanner).toBeVisible();
    await expect(checkout.errorBanner).toHaveText(/email/);
  });

  // @Priority:3
  // @Severity:2
  // @US:42
  // @SP:2
  // @PageObject:CheckoutPage
  test('Permite continuar con email válido', async ({ page }) => {
    const checkout = new CheckoutPage(page);
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
    await expect(checkout.errorBanner).toBeHidden();
  });
});
