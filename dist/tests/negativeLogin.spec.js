"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
// Helper para asignar tags a un test
function withTags(tags, fn) {
    fn.tags = tags;
    return fn;
}
const LoginPage_1 = require("./pageObjects/LoginPage");
// Casos negativos y límites para login
test_1.test.describe('Login Negativo', () => {
    // @Priority:1
    // @Severity:4
    // @US:1
    // @SP:1
    // @PageObject:LoginPage
    (0, test_1.test)('Usuario y contraseña incorrectos', {
        annotations: [
            { type: 'US', description: '1' },
            { type: 'SP', description: '1' },
            { type: 'Severity', description: '4' },
            { type: 'testcase', description: 'LOGIN-FAIL' }
        ]
    }, async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('usuario_invalido', 'clave_invalida');
        await (0, test_1.expect)(login.errorBanner).toBeVisible();
        await (0, test_1.expect)(login.errorBanner).toHaveText(/Username and password do not match/);
    });
    // @Priority:2
    // @Severity:3
    // @US:2
    // @SP:1
    // @PageObject:LoginPage
    (0, test_1.test)('Campos vacíos', {
        annotations: [
            { type: 'US', description: '2' },
            { type: 'SP', description: '1' },
            { type: 'Severity', description: '3' },
            { type: 'testcase', description: 'LOGIN-EMPTY' }
        ]
    }, async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('', '');
        await (0, test_1.expect)(login.errorBanner).toBeVisible();
    });
    // @Priority:3
    // @Severity:2
    // @US:3
    // @SP:2
    // @PageObject:LoginPage
    (0, test_1.test)('Usuario errorUser muestra error especial', {
        annotations: [
            { type: 'US', description: '3' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'LOGIN-EPIC' }
        ]
    }, async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_errorUser', 'secret_uno');
        await (0, test_1.expect)(login.errorBanner).toBeVisible();
        await (0, test_1.expect)(login.errorBanner).toHaveText(/Epic Error/);
    });
    // @Priority:4
    // @Severity:2
    // @US:4
    // @SP:2
    // @PageObject:LoginPage
    (0, test_1.test)('Usuario performanceUser muestra loading', {
        annotations: [
            { type: 'US', description: '4' },
            { type: 'SP', description: '2' },
            { type: 'Severity', description: '2' },
            { type: 'testcase', description: 'LOGIN-LOAD' }
        ]
    }, async ({ page }) => {
        const login = new LoginPage_1.LoginPage(page);
        await login.goto('http://localhost:5500');
        await login.login('unosquare_performanceUser', 'secret_uno');
        await (0, test_1.expect)(page.locator('#loading-overlay')).toBeVisible();
        // Espera a que desaparezca el loading
        await (0, test_1.expect)(page.locator('#loading-overlay')).toBeHidden({ timeout: 12000 });
    });
});
