import BasePage from './base.page';

class ResetPasswordPage extends BasePage {
    get newPasswordInput() {
        return $('#newPassword');
    }

    get confirmPasswordInput() {
        return $('#confirmPassword');
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

    async resetPassword(newPassword: string, confirmPassword: string) {
        await this.newPasswordInput.setValue(newPassword);
        await this.confirmPasswordInput.setValue(confirmPassword);
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

    openWithToken(token: string) {
        return super.open(`/reset-password?token=${token}`);
    }
}

export default new ResetPasswordPage();
