import LoginPage from '../../pageobjects/login.page';
import DashboardPage from '../../pageobjects/dashboard.page';

describe('Login Page', () => {
    beforeEach(async () => {
        await LoginPage.open();
    });

    it('should display login form', async () => {
        await expect(LoginPage.inputUsername).toBeDisplayed();
        await expect(LoginPage.inputPassword).toBeDisplayed();
        await expect(LoginPage.btnSubmit).toBeDisplayed();
    });

    it('should show error for invalid credentials', async () => {
        await LoginPage.login('invaliduser', 'invalidpass');
        
        await expect(LoginPage.errorAlert).toBeDisplayed();
        const errorMessage = await LoginPage.getErrorMessage();
        await expect(errorMessage).toContain('Invalid username or password');
    });

    it('should disable login button when fields are empty', async () => {
        const isDisabled = await LoginPage.isLoginButtonDisabled();
        await expect(isDisabled).toBe(true);
    });

    it('should successfully login with valid credentials', async () => {
        const username = process.env.TEST_USERNAME || 'testuser';
        const password = process.env.TEST_PASSWORD || 'Test123!';
        
        await LoginPage.login(username, password);
        
        // Wait for redirect to dashboard
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/dashboard'),
            {
                timeout: 10000,
                timeoutMsg: 'Expected to redirect to dashboard'
            }
        );
        
        await expect(DashboardPage.navbarBrand).toBeDisplayed();
    });

    it('should navigate to register page when clicking register link', async () => {
        await LoginPage.goToRegister();
        
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/register'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected to navigate to register page'
            }
        );
    });

    it('should validate required fields', async () => {
        // Try to submit without filling fields
        await LoginPage.click(LoginPage.btnSubmit);
        
        // Button should be disabled or form should not submit
        const currentUrl = await browser.getUrl();
        await expect(currentUrl).toContain('/login');
    });
});
