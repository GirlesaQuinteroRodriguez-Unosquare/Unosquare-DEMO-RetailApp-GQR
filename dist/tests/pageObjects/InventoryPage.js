"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
class InventoryPage {
    page;
    inventoryContainer;
    cartButton;
    sortSelect;
    categoryFilter;
    priceFilter;
    constructor(page) {
        this.page = page;
        this.inventoryContainer = page.locator('#inventory-container');
        this.cartButton = page.locator('#cart-btn');
        this.sortSelect = page.locator('#sort-select');
        this.categoryFilter = page.locator('#category-filter');
        this.priceFilter = page.locator('#price-filter');
    }
    async addProductToCartByName(productName) {
        const product = this.page.locator('.inventory-item', { hasText: productName });
        await product.locator('button.add-to-cart-btn').click();
    }
    async openCart() {
        await this.cartButton.click();
    }
    async filterByCategory(category) {
        await this.categoryFilter.selectOption(category);
    }
    async filterByPrice(price) {
        await this.priceFilter.fill(price);
    }
}
exports.InventoryPage = InventoryPage;
