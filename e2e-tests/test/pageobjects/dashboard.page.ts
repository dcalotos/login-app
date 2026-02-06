import BasePage from './base.page';

/**
 * Dashboard page object
 */
class DashboardPage extends BasePage {
    /**
     * Define selectors
     */
    get navbarBrand() {
        return $('.navbar-brand');
    }

    get navbarUsername() {
        return $('.navbar-username');
    }

    get btnLogout() {
        return $('.btn-danger');
    }

    get cardTitle() {
        return $('.card-title');
    }

    get userInfo() {
        return $('.user-info');
    }

    get userInfoItems() {
        return $$('.user-info-item');
    }

    get successAlert() {
        return $('.alert-info');
    }

    /**
     * Open dashboard page
     */
    async open(): Promise<void> {
        await super.open('/dashboard');
        await this.waitForPageLoad();
    }

    /**
     * Get username from navbar
     */
    async getNavbarUsername(): Promise<string> {
        await this.waitForDisplayed(this.navbarUsername);
        return await this.getText(this.navbarUsername);
    }

    /**
     * Perform logout
     */
    async logout(): Promise<void> {
        await this.click(this.btnLogout);
        // Handle browser alert
        await browser.acceptAlert();
    }

    /**
     * Check if user is logged in (dashboard is displayed)
     */
    async isLoggedIn(): Promise<boolean> {
        return await this.isDisplayed(this.navbarBrand);
    }

    /**
     * Get user info value by label
     */
    async getUserInfoValue(label: string): Promise<string> {
        const items = await this.userInfoItems;
        for (const item of items) {
            const labelElement = await item.$('.user-info-label');
            const labelText = await labelElement.getText();
            
            if (labelText.includes(label)) {
                const valueElement = await item.$('.user-info-value');
                return await valueElement.getText();
            }
        }
        return '';
    }

    /**
     * Check if success message is displayed
     */
    async isSuccessMessageDisplayed(): Promise<boolean> {
        return await this.isDisplayed(this.successAlert);
    }
}

export default new DashboardPage();
