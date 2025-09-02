"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
class LoginPage {
    page;
    usernameInput;
    passwordInput;
    loginButton;
    guestButton;
    errorBanner;
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-form button[type="submit"]');
        this.guestButton = page.locator('#guest-checkout-btn');
        this.errorBanner = page.locator('.error-message');
    }
    async goto(baseUrl = 'http://localhost:5500') {
        await this.page.goto(baseUrl);
    }
    async login(username, password) {
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
exports.LoginPage = LoginPage;
