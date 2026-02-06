import LoginPage from '../../pageobjects/login.page';
import RegisterPage from '../../pageobjects/register.page';
import DashboardPage from '../../pageobjects/dashboard.page';

describe('Complete Authentication Flow', () => {
    it('should complete full registration and login flow', async () => {
        const timestamp = Date.now();
        const username = `flowuser${timestamp}`;
        const email = `flowuser${timestamp}@test.com`;
        const password = 'FlowTest123!';
        const firstName = 'Flow';
        const lastName = 'User';

        // Step 1: Register new user
        await RegisterPage.open();
        await RegisterPage.register(username, email, password, password, firstName, lastName);
        
        // Wait for success and redirect to login
        await browser.waitUntil(
            async () => await RegisterPage.isSuccessDisplayed(),
            {
                timeout: 5000,
                timeoutMsg: 'Expected success message after registration'
            }
        );
        
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected redirect to login page'
            }
        );

        // Step 2: Login with new credentials
        await LoginPage.login(username, password);
        
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/dashboard'),
            {
                timeout: 10000,
                timeoutMsg: 'Expected redirect to dashboard'
            }
        );

        // Step 3: Verify dashboard displays correct user info
        const navbarUsername = await DashboardPage.getNavbarUsername();
        await expect(navbarUsername).toBe(username);
        
        const dashboardUsername = await DashboardPage.getUserInfoValue('Username');
        await expect(dashboardUsername).toBe(username);
        
        const dashboardEmail = await DashboardPage.getUserInfoValue('Email');
        await expect(dashboardEmail).toBe(email);

        // Step 4: Logout
        await DashboardPage.logout();
        
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected redirect to login after logout'
            }
        );

        // Step 5: Verify can't access dashboard without auth
        await DashboardPage.open();
        
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected redirect to login when accessing protected route'
            }
        );
    });

    it('should prevent access to protected routes without authentication', async () => {
        // Try to access dashboard directly
        await DashboardPage.open();
        
        // Should redirect to login
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/login'),
            {
                timeout: 5000,
                timeoutMsg: 'Expected redirect to login page'
            }
        );
        
        await expect(LoginPage.inputUsername).toBeDisplayed();
    });
});
