import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('#checkout-btn');
    this.cartItems = page.locator('#cart-items');
    this.cartTotal = page.locator('#cart-total');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getCartTotal() {
    return this.cartTotal.textContent();
  }
}
