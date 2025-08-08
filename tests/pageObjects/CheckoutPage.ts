import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly paymentTypeSelect: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly continueButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.zipCodeInput = page.locator('#zip-code');
    this.streetAddressInput = page.locator('#street-address');
    this.cityInput = page.locator('#city');
    this.stateInput = page.locator('#state');
    this.paymentTypeSelect = page.locator('#payment-type');
    this.cardNumberInput = page.locator('#card-number');
    this.expiryDateInput = page.locator('#expiry-date');
    this.cvvInput = page.locator('#cvv');
    this.continueButton = page.locator('button[type="submit"]');
    this.errorBanner = page.locator('.error-message');
  }

  async fillCheckoutForm(data: {
    email?: string;
    firstName: string;
    lastName: string;
    zipCode: string;
    streetAddress: string;
    city: string;
    state: string;
    paymentType: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) {
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.zipCodeInput.fill(data.zipCode);
    await this.streetAddressInput.fill(data.streetAddress);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.paymentTypeSelect.selectOption(data.paymentType);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expiryDateInput.fill(data.expiryDate);
    await this.cvvInput.fill(data.cvv);
  }

  async submit() {
    await this.continueButton.click();
  }

  async getErrorMessage() {
    return this.errorBanner.textContent();
  }
}
