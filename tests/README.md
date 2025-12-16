# GNG Task Test Suite

This directory contains comprehensive tests for the Go/No-Go task using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Start local server (tests will start it automatically, but you can also run manually):
```bash
python3 -m http.server 8000
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run specific test suite
```bash
npm run test:scientific    # Scientific validity tests
npm run test:timing        # Timing accuracy tests
npm run test:data          # Data integrity tests
npm run test:standalone    # Standalone integration tests
npm run test:browser        # Cross-browser tests
```

### Run in headed mode (see browser)
```bash
npm run test:headed
```

### Run with UI mode
```bash
npm run test:ui
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run test:report
```

## Test Structure

- `scientific/` - Tests for scientific validity (Go/No-Go trials, accuracy)
- `performance/` - Tests for timing accuracy
- `data-integrity/` - Tests for data structure and completeness
- `integration/` - Full integration tests
- `browser/` - Cross-browser compatibility tests
- `fixtures/` - Helper functions and test data

## Test Configuration

Tests are configured in `playwright.config.js`. The default configuration:
- Uses local server on port 8000
- Tests in Chromium, Firefox, and WebKit
- Generates HTML reports
- Captures screenshots on failure
- Records video on failure

## Notes

- Some tests may take several minutes to complete (full experiment runs)
- Qualtrics version tests require Qualtrics environment (currently skipped)
- Timing tests have ±10ms tolerance for browser timing variations
- Tests use simplified trial completion for efficiency

