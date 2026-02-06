# E2E Tests - Login Application

End-to-end tests using WebDriverIO with support for web browsers, BrowserStack, and mobile apps via Appium.

## Setup

### Prerequisites

- Node.js 18+
- Java (for Appium)
- Android SDK (for Android testing)
- Xcode (for iOS testing, macOS only)

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- `BASE_URL`: Application URL
- `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`: BrowserStack credentials
- Test user credentials

## Running Tests

### Local Web Tests

```bash
npm run test:local
```

### BrowserStack Tests

```bash
npm run test:browserstack
```

### Mobile Tests (Appium)

```bash
# Android
npm run test:mobile:android

# iOS
npm run test:mobile:ios

# Both
npm run test:mobile
```

## Test Structure

```
test/
├── pageobjects/          # Page Object Models
│   ├── base.page.ts      # Base page with common methods
│   ├── login.page.ts     # Login page
│   ├── register.page.ts  # Register page
│   └── dashboard.page.ts # Dashboard page
├── specs/
│   ├── web/              # Web browser tests
│   └── mobile/           # Mobile app tests
└── utils/                # Test utilities
```

## Page Object Pattern

All tests use the Page Object pattern for maintainability:

```typescript
import LoginPage from '../pageobjects/login.page';

describe('Login', () => {
    it('should login successfully', async () => {
        await LoginPage.open();
        await LoginPage.login('username', 'password');
        // assertions...
    });
});
```

## Reports

### Allure Reports

Generate and view Allure reports:

```bash
# Generate report
npx allure generate allure-results --clean

# Open report
npx allure open
```

## BrowserStack Configuration

Tests can run on multiple browsers and platforms via BrowserStack:
- Chrome (Windows 11)
- Firefox (Windows 11)
- Safari (macOS Monterey)

## Mobile Testing

Mobile tests require:
1. Appium server running
2. Mobile app builds (.apk for Android, .ipa for iOS)
3. Emulator/Simulator or real device

The tests will automatically start Appium when running mobile tests.

## Troubleshooting

### Appium Issues
- Ensure Java is installed
- Check Android SDK path
- Verify device/emulator is running

### BrowserStack Issues
- Verify credentials in `.env`
- Check BrowserStack account limits

### Test Failures
- Screenshots are automatically taken on failure
- Check `errorShots/` directory
- Review Allure reports for details
