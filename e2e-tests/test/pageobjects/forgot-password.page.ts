import BasePage from './base.page';

class ForgotPasswordPage extends BasePage {
    get emailInput() {
        return $('#email');
    }

    get submitButton() {
        return $('button[type="submit"]');
    }

    get successMessage() {
        return $('.alert-success');
    }

    get errorMessage() {
        return $('.alert-error');
    }

    get backToLoginLink() {
        return $('a[href="/login"]');
    }

    async requestPasswordReset(email: string) {
        await this.emailInput.setValue(email);
        await this.submitButton.click();
    }

    async getSuccessMessage() {
        await this.successMessage.waitForDisplayed({ timeout: 5000 });
        return await this.successMessage.getText();
    }

    async getErrorMessage() {
        await this.errorMessage.waitForDisplayed({ timeout: 5000 });
        return await this.errorMessage.getText();
    }

    open() {
        return super.open('/forgot-password');
    }
}

export default new ForgotPasswordPage();
