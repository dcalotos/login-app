import BasePage from './base.page';

/**
 * Register page object
 */
class RegisterPage extends BasePage {
    /**
     * Define selectors
     */
    get inputUsername() {
        return $('#username');
    }

    get inputEmail() {
        return $('#email');
    }

    get inputFirstName() {
        return $('#firstName');
    }

    get inputLastName() {
        return $('#lastName');
    }

    get inputPassword() {
        return $('#password');
    }

    get inputConfirmPassword() {
        return $('#confirmPassword');
    }

    get btnSubmit() {
        return $('button[type="submit"]');
    }

    get errorAlert() {
        return $('.alert-danger');
    }

    get successAlert() {
        return $('.alert-success');
    }

    get loginLink() {
        return $('a[href="/login"]');
    }

    /**
     * Open register page
     */
    async open(): Promise<void> {
        await super.open('/register');
        await this.waitForPageLoad();
    }

    /**
     * Perform registration
     */
    async register(
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
        firstName?: string,
        lastName?: string
    ): Promise<void> {
        await this.setValue(this.inputUsername, username);
        await this.setValue(this.inputEmail, email);
        
        if (firstName) {
            await this.setValue(this.inputFirstName, firstName);
        }
        
        if (lastName) {
            await this.setValue(this.inputLastName, lastName);
        }
        
        await this.setValue(this.inputPassword, password);
        await this.setValue(this.inputConfirmPassword, confirmPassword);
        await this.click(this.btnSubmit);
    }

    /**
     * Get error message
     */
    async getErrorMessage(): Promise<string> {
        await this.waitForDisplayed(this.errorAlert);
        return await this.getText(this.errorAlert);
    }

    /**
     * Get success message
     */
    async getSuccessMessage(): Promise<string> {
        await this.waitForDisplayed(this.successAlert);
        return await this.getText(this.successAlert);
    }

    /**
     * Check if success alert is displayed
     */
    async isSuccessDisplayed(): Promise<boolean> {
        return await this.isDisplayed(this.successAlert);
    }

    /**
     * Navigate to login page
     */
    async goToLogin(): Promise<void> {
        await this.click(this.loginLink);
    }
}

export default new RegisterPage();
