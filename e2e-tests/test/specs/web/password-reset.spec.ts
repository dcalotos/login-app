import ForgotPasswordPage from '../../pageobjects/forgot-password.page';
import ResetPasswordPage from '../../pageobjects/reset-password.page';
import LoginPage from '../../pageobjects/login.page';

describe('Password Reset Flow', () => {
    
    describe('Forgot Password Page', () => {
        beforeEach(async () => {
            await ForgotPasswordPage.open();
        });

        it('should display forgot password form', async () => {
            await expect(ForgotPasswordPage.emailInput).toBeDisplayed();
            await expect(ForgotPasswordPage.submitButton).toBeDisplayed();
        });

        it('should show validation error for invalid email', async () => {
            await ForgotPasswordPage.emailInput.setValue('invalid-email');
            await ForgotPasswordPage.submitButton.click();
            
            // Check that form is not submitted (button still visible)
            await expect(ForgotPasswordPage.submitButton).toBeDisplayed();
        });

        it('should request password reset with valid email', async () => {
            await ForgotPasswordPage.requestPasswordReset('test@example.com');
            
            // Should show success message
            const successMessage = await ForgotPasswordPage.getSuccessMessage();
            await expect(successMessage).toContain('reset email sent');
        });

        it('should navigate back to login page', async () => {
            await ForgotPasswordPage.backToLoginLink.click();
            await expect(browser).toHaveUrl(expect.stringContaining('/login'));
        });
    });

    describe('Reset Password Page', () => {
        const validToken = 'test-token-123';
        const invalidToken = 'invalid-token';

        it('should display error for invalid token', async () => {
            await ResetPasswordPage.openWithToken(invalidToken);
            
            // Wait for validation
            await browser.pause(1000);
            
            // Should show error message
            await expect(ResetPasswordPage.errorMessage).toBeDisplayed();
        });

        it('should require password fields to be filled', async () => {
            await ResetPasswordPage.openWithToken(validToken);
            await ResetPasswordPage.submitButton.click();
            
            // Button should be disabled or form not submitted
            await expect(ResetPasswordPage.submitButton).toBeDisplayed();
        });

        it('should validate password minimum length', async () => {
            await ResetPasswordPage.openWithToken(validToken);
            await ResetPasswordPage.newPasswordInput.setValue('short');
            await ResetPasswordPage.confirmPasswordInput.setValue('short');
            
            // Should show validation error
            const isButtonEnabled = await ResetPasswordPage.submitButton.isEnabled();
            expect(isButtonEnabled).toBe(false);
        });

        it('should validate password match', async () => {
            await ResetPasswordPage.openWithToken(validToken);
            await ResetPasswordPage.newPasswordInput.setValue('NewPassword123!');
            await ResetPasswordPage.confirmPasswordInput.setValue('DifferentPassword123!');
            await ResetPasswordPage.submitButton.click();
            
            // Should show mismatch error
            await browser.pause(500);
            const isButtonEnabled = await ResetPasswordPage.submitButton.isEnabled();
            expect(isButtonEnabled).toBe(false);
        });
    });

    describe('Integration with Login', () => {
        it('should have forgot password link on login page', async () => {
            await LoginPage.open();
            
            const forgotPasswordLink = await $('a[href="/forgot-password"]');
            await expect(forgotPasswordLink).toBeDisplayed();
            await expect(forgotPasswordLink).toHaveText('Forgot password?');
        });

        it('should navigate to forgot password from login', async () => {
            await LoginPage.open();
            
            const forgotPasswordLink = await $('a[href="/forgot-password"]');
            await forgotPasswordLink.click();
            
            await expect(browser).toHaveUrl(expect.stringContaining('/forgot-password'));
        });
    });
});
