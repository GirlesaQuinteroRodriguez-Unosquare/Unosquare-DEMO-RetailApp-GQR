import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly cartButton: Locator;
  readonly sortSelect: Locator;
  readonly categoryFilter: Locator;
  readonly priceFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = page.locator('#inventory-container');
    this.cartButton = page.locator('#cart-btn');
    this.sortSelect = page.locator('#sort-select');
    this.categoryFilter = page.locator('#category-filter');
    this.priceFilter = page.locator('#price-filter');
  }

  async addProductToCartByName(productName: string) {
    const product = this.page.locator('.inventory-item', { hasText: productName });
    await product.locator('button.add-to-cart-btn').click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async filterByPrice(price: string) {
    await this.priceFilter.fill(price);
  }
}
