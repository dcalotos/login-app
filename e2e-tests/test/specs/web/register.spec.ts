import RegisterPage from '../../pageobjects/register.page';

describe('Register Page', () => {
    beforeEach(async () => {
        await RegisterPage.open();
    });

    it('should display registration form', async () => {
        await expect(RegisterPage.inputUsername).toBeDisplayed();
        await expect(RegisterPage.inputEmail).toBeDisplayed();
        await expect(RegisterPage.inputPassword).toBeDisplayed();
        await expect(RegisterPage.inputConfirmPassword).toBeDisplayed();
        await expect(RegisterPage.btnSubmit).toBeDisplayed();
    });

    it('should show error when passwords do not match', async () => {
        const timestamp = Date.now();
        await RegisterPage.register(
            `user${timestamp}`,
            `user${timestamp}@test.com`,
            'Password123!',
            'DifferentPassword123!',
            'Test',
            'User'
        );
        
        await expect(RegisterPage.errorAlert).toBeDisplayed();
        const errorMessage = await RegisterPage.getErrorMessage();
        await expect(errorMessage).toContain('Passwords do not match');
    });

    it('should show error for password less than 8 characters', async () => {
        const timestamp = Date.now();
        await RegisterPage.register(
            `user${timestamp}`,
            `user${timestamp}@test.com`,
            'Pass1!',
            'Pass1!',
            'Test',
            'User'
        );
        
        await expect(RegisterPage.errorAlert).toBeDisplayed();
        const errorMessage = await RegisterPage.getErrorMessage();
        await expect(errorMessage).toContain('at least 8 characters');
    });

    it('should successfully register a new user', async () => {
        const timestamp = Date.now();
        const username = `user${timestamp}`;
        const email = `user${timestamp}@test.com`;
        const password = 'Password123!';
        
        await RegisterPage.register(
            username,
            email,
            password,
            password,
            'Test',
            'User'
        );
        
        // Wait for success message
        await browser.waitUntil(
            async () => await RegisterPage.isSuccessDisplayed(),
            {
                timeout: 5000,
                timeoutMsg: 'Expected success message to be displayed'
            }
        );
        
        const successMessage = await RegisterPage.getSuccessMessage();
        await expect(successMessage).toContain('Registration successful');
        
        // Should redirect to login page
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to redirect to login page'
            }
        );
    });

    it('should navigate to login page when clicking login link', async () => {
        await RegisterPage.goToLogin();
        
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to navigate to login page'
            }
        );
    });

    it('should show error for duplicate username', async () => {
        const existingUsername = process.env.TEST_USERNAME || 'testuser';
        const timestamp = Date.now();
        
        await RegisterPage.register(
            existingUsername,
            `newemail${timestamp}@test.com`,
            'Password123!',
            'Password123!',
            'Test',
            'User'
        );
        
        await expect(RegisterPage.errorAlert).toBeDisplayed();
        const errorMessage = await RegisterPage.getErrorMessage();
        await expect(errorMessage).toContain('Username is already taken');
    });
});
