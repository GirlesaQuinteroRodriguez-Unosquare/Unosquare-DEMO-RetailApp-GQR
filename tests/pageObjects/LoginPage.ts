import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly guestButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-form button[type="submit"]');
    this.guestButton = page.locator('#guest-checkout-btn');
    this.errorBanner = page.locator('.error-message');
  }

  async goto(baseUrl: string = 'http://localhost:5500') {
    await this.page.goto(baseUrl);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async continueAsGuest() {
    await this.guestButton.click();
  }

  async getErrorMessage() {
    return this.errorBanner.textContent();
  }
}
