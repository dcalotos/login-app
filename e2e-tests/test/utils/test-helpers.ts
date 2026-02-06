/**
 * Utility functions for tests
 */

/**
 * Generate random string
 */
export function generateRandomString(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
    return `test_${generateRandomString(8)}@example.com`;
}

/**
 * Generate random username
 */
export function generateRandomUsername(): string {
    return `user_${generateRandomString(8)}`;
}

/**
 * Wait for specified time
 */
export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate test user data
 */
export function generateTestUser() {
    const timestamp = Date.now();
    return {
        username: `testuser${timestamp}`,
        email: `testuser${timestamp}@test.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
    };
}
