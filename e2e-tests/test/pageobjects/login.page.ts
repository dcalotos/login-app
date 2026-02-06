import BasePage from './base.page';

/**
 * Login page object
 */
class LoginPage extends BasePage {
    /**
     * Define selectors
     */
    get inputUsername() {
        return $('#username');
    }

    get inputPassword() {
        return $('#password');
    }

    get btnSubmit() {
        return $('button[type="submit"]');
    }

    get errorAlert() {
        return $('.alert-danger');
    }

    get registerLink() {
        return $('a[href="/register"]');
    }

    /**
     * Open login page
     */
    async open(): Promise<void> {
        await super.open('/login');
        await this.waitForPageLoad();
    }

    /**
     * Perform login
     */
    async login(username: string, password: string): Promise<void> {
        await this.setValue(this.inputUsername, username);
        await this.setValue(this.inputPassword, password);
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
     * Check if error is displayed
     */
    async isErrorDisplayed(): Promise<boolean> {
        return await this.isDisplayed(this.errorAlert);
    }

    /**
     * Navigate to register page
     */
    async goToRegister(): Promise<void> {
        await this.click(this.registerLink);
    }

    /**
     * Check if login button is disabled
     */
    async isLoginButtonDisabled(): Promise<boolean> {
        return !(await this.btnSubmit.isEnabled());
    }
}

export default new LoginPage();
