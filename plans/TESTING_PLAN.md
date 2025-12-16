# Testing Plan: Comprehensive Scientific Validity Testing Suite

## Overview

This document outlines a comprehensive testing strategy for the Go/No-Go (GNG) task using Playwright to ensure scientific validity, reliability, and reproducibility of the cognitive task implementation.

## Objectives

1. **Scientific Validity**: Verify that the task accurately measures response inhibition
2. **Timing Accuracy**: Ensure precise timing for MRI/fMRI alignment
3. **Data Integrity**: Validate correct data collection and storage
4. **Behavioral Accuracy**: Confirm correct response recording and scoring
5. **Reproducibility**: Ensure consistent task execution across runs
6. **Cross-Browser Compatibility**: Verify task works across different browsers
7. **Error Handling**: Test edge cases and error conditions

## Testing Framework: Playwright

### Why Playwright?

- **Cross-browser testing**: Chrome, Firefox, Safari, Edge
- **Precise timing control**: Critical for validating trial durations
- **Keyboard simulation**: Accurate keypress testing
- **Screenshot/video capture**: Visual validation of stimuli
- **Network interception**: Test script loading and resource fetching
- **Console monitoring**: Capture and validate debug logs
- **Mobile device emulation**: Test responsive behavior

### Installation

```bash
npm init -y
npm install --save-dev @playwright/test
npx playwright install
```

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── timing.test.js      # Timing validation tests
│   ├── responses.test.js   # Response handling tests
│   └── data.test.js        # Data collection tests
├── integration/            # Integration tests
│   ├── standalone.test.js  # Standalone version tests
│   ├── qualtrics.test.js   # Qualtrics version tests
│   └── mri-trigger.test.js # MRI trigger tests
├── scientific/             # Scientific validity tests
│   ├── go-trials.test.js   # Go trial validation
│   ├── no-go-trials.test.js # No-Go trial validation
│   ├── accuracy.test.js    # Accuracy calculation tests
│   └── timing-sequence.test.js # Fixed timing sequence tests
├── performance/            # Performance and timing tests
│   ├── trial-timing.test.js # Trial duration accuracy
│   ├── fixation-timing.test.js # Fixation duration tests
│   └── stimulus-timing.test.js # Stimulus duration tests
├── data-integrity/         # Data collection validation
│   ├── data-structure.test.js # Data format validation
│   ├── data-completeness.test.js # Missing data detection
│   └── data-export.test.js # Data export validation
├── browser/                # Cross-browser tests
│   ├── chrome.test.js
│   ├── firefox.test.js
│   └── safari.test.js
├── fixtures/               # Test data and helpers
│   ├── test-data.js        # Mock data and responses
│   └── helpers.js          # Test utility functions
└── reports/                # Test reports (gitignored)
    └── screenshots/
```

## Test Categories

### 1. Scientific Validity Tests

#### 1.1 Go Trial Validity
- **Test**: Verify Go trials require keypress response
- **Validation**: 
  - Blue circle appears
  - F key (standalone) or '1' key (Qualtrics) is accepted
  - Response is recorded with RT
  - Correctness is calculated as true when key matches
  - Correctness is calculated as false when wrong key or no response

#### 1.2 No-Go Trial Validity
- **Test**: Verify No-Go trials require response withholding
- **Validation**:
  - Orange circle appears
  - No keypress is required
  - Correctness is true when no response
  - Correctness is false when keypress occurs
  - RT is null for correct No-Go trials

#### 1.3 Response Accuracy Calculation
- **Test**: Verify accuracy percentage calculation
- **Validation**:
  - Correctly counts Go trial accuracy
  - Correctly counts No-Go trial accuracy
  - Handles edge cases (all correct, all incorrect)
  - Prevents division by zero
  - Displays accurate percentage in debrief

#### 1.4 Stimulus Presentation
- **Test**: Verify correct stimuli are shown
- **Validation**:
  - Go stimuli (blue circles) appear for Go trials
  - No-Go stimuli (orange circles) appear for No-Go trials
  - Images load correctly
  - Stimuli are centered and visible

### 2. Timing Accuracy Tests

#### 2.1 Fixation Duration
- **Test**: Verify fixation durations match specifications
- **Validation**:
  - Standalone: 250, 500, 750, 1000, 1250, 1500, 1750, 2000ms
  - Qualtrics: 500, 750, 1000ms
  - Actual duration matches expected (within tolerance)
  - Duration is stored in trial data

#### 2.2 Stimulus Duration
- **Test**: Verify stimulus presentation duration
- **Validation**:
  - Standalone: 1000ms fixed
  - Qualtrics: 2000, 2500, 3000, 3500ms variable
  - Actual duration matches expected (within tolerance)
  - Duration is stored in trial data

#### 2.3 Fixed Timing Sequence
- **Test**: Verify timing sequences are fixed and reproducible
- **Validation**:
  - Same sequence across multiple runs
  - Sequence is documented and predictable
  - Timing values match predetermined sequence
  - Index tracking is correct

#### 2.4 Trial Timing Precision
- **Test**: Measure actual vs. expected timing
- **Validation**:
  - Timing accuracy within ±10ms tolerance
  - No systematic timing drift
  - Consistent timing across browsers
  - Timing data stored correctly

### 3. Response Handling Tests

#### 3.1 Keyboard Response Recording
- **Test**: Verify keyboard responses are captured
- **Validation**:
  - Correct key is recorded (F or '1')
  - Response time is measured accurately
  - Response is recorded even if trial doesn't end
  - Multiple keypresses handled correctly

#### 3.2 Response Restriction
- **Test**: Verify only valid keys are accepted
- **Validation**:
  - Only F key accepted in standalone version
  - Only '1' key accepted in Qualtrics version
  - Other keys are ignored during test trials
  - MRI trigger key '5' works correctly

#### 3.3 Mouse Click Prevention
- **Test**: Verify mouse clicks don't advance test trials
- **Validation**:
  - Clicks during test trials don't advance
  - Clicks during instruction screens work (expected)
  - response_ends_trial: false is respected
  - Only keyboard responses recorded

#### 3.4 Response Timing
- **Test**: Verify response time measurement
- **Validation**:
  - RT measured from stimulus onset
  - RT is null when no response
  - RT is accurate (within measurement tolerance)
  - RT stored in trial data

### 4. Data Integrity Tests

#### 4.1 Data Structure Validation
- **Test**: Verify data structure matches specification
- **Validation**:
  - All required fields present
  - Field types are correct
  - No unexpected fields
  - Data structure consistent across trials

#### 4.2 Data Completeness
- **Test**: Verify all trials have complete data
- **Validation**:
  - No missing trial data
  - All required fields populated
  - No null values in critical fields
  - Data count matches expected trial count

#### 4.3 Correctness Calculation
- **Test**: Verify correctness is calculated correctly
- **Validation**:
  - Go trials: correct when key matches
  - Go trials: incorrect when wrong key or no response
  - No-Go trials: correct when no response
  - No-Go trials: incorrect when keypress occurs
  - Edge cases handled correctly

#### 4.4 Data Export
- **Test**: Verify data export functionality
- **Validation**:
  - Standalone: Data displayed/exportable
  - Qualtrics: Data saved to embedded data field
  - JSON format is valid
  - All trials included in export

### 5. Trial Sequence Tests

#### 5.1 Trial Count
- **Test**: Verify correct number of trials
- **Validation**:
  - Standalone: 40 trials (20 reps × 2 stimuli)
  - Qualtrics: 80 trials (5 reps × 16 stimuli)
  - Fixation trials counted separately
  - Total trial count matches specification

#### 5.2 Stimulus Order
- **Test**: Verify stimulus presentation order
- **Validation**:
  - Standalone: Randomized order (if enabled)
  - Qualtrics: Fixed order (16 stimuli × 5 reps)
  - Go/No-Go ratio matches specification
  - Pattern repeats correctly

#### 5.3 Trial Progression
- **Test**: Verify trials progress correctly
- **Validation**:
  - Trials advance in correct order
  - No skipped trials
  - No duplicate trials
  - Trial indices are sequential

### 6. MRI Integration Tests

#### 6.1 MRI Trigger
- **Test**: Verify MRI scanner trigger functionality
- **Validation**:
  - Waits for key '5' before test trials
  - Only key '5' accepted during MRI start
  - Other keys ignored during MRI start
  - Test trials begin after trigger

#### 6.2 Timing Alignment
- **Test**: Verify timing data for MRI alignment
- **Validation**:
  - Fixation durations stored
  - Stimulus durations stored
  - Trial sequence indices stored
  - Timing data sufficient for MRI alignment

### 7. Cross-Browser Tests

#### 7.1 Browser Compatibility
- **Test**: Verify task works across browsers
- **Validation**:
  - Chrome: All functionality works
  - Firefox: All functionality works
  - Safari: All functionality works
  - Edge: All functionality works

#### 7.2 Browser-Specific Issues
- **Test**: Identify browser-specific problems
- **Validation**:
  - Keyboard handling consistent
  - Timing accuracy consistent
  - Visual rendering consistent
  - Data collection consistent

### 8. Error Handling Tests

#### 8.1 Image Loading Errors
- **Test**: Verify handling of missing images
- **Validation**:
  - Error message displayed
  - Task doesn't crash
  - Preload handles errors gracefully
  - Fallback behavior works

#### 8.2 Script Loading Errors
- **Test**: Verify handling of script loading failures
- **Validation**:
  - Error message displayed (Qualtrics)
  - Task doesn't proceed with missing scripts
  - User-friendly error messages
  - Recovery options provided

#### 8.3 Edge Cases
- **Test**: Verify handling of edge cases
- **Validation**:
  - No responses: Handled correctly
  - Multiple rapid responses: Handled correctly
  - Browser focus loss: Handled correctly
  - Network interruptions: Handled correctly

## Test Implementation Details

### Playwright Configuration

```javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  use: {
    baseURL: 'http://localhost:8000',
    headless: false, // Set to true for CI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
};
```

### Test Helper Functions

```javascript
// tests/fixtures/helpers.js

// Wait for trial to start
async function waitForTrialStart(page) {
  await page.waitForSelector('.jspsych-content', { state: 'visible' });
}

// Simulate keypress
async function pressKey(page, key) {
  await page.keyboard.press(key);
}

// Get trial data from console
async function getTrialData(page) {
  const logs = [];
  page.on('console', msg => {
    if (msg.text().includes('[GNG]')) {
      logs.push(msg.text());
    }
  });
  return logs;
}

// Measure timing accuracy
async function measureTiming(page, expectedDuration, tolerance = 10) {
  const startTime = Date.now();
  await page.waitForTimeout(expectedDuration);
  const actualDuration = Date.now() - startTime;
  const difference = Math.abs(actualDuration - expectedDuration);
  return difference <= tolerance;
}

// Extract data from jsPsych
async function extractJsPsychData(page) {
  return await page.evaluate(() => {
    if (window.jsPsych) {
      return window.jsPsych.data.get().json();
    }
    return null;
  });
}
```

### Example Test: Go Trial Validity

```javascript
// tests/scientific/go-trials.test.js
const { test, expect } = require('@playwright/test');

test.describe('Go Trial Validity', () => {
  test('should require keypress for blue circle', async ({ page }) => {
    await page.goto('/src/index.html');
    
    // Navigate to test trials
    await page.click('text=NEXT'); // Welcome
    await page.click('text=NEXT'); // Instructions
    // ... navigate through instructions
    
    // Wait for Go trial (blue circle)
    await page.waitForSelector('img[src*="blue.png"]');
    
    // Press F key
    const startTime = Date.now();
    await page.keyboard.press('f');
    const responseTime = Date.now() - startTime;
    
    // Verify response was recorded
    const data = await extractJsPsychData(page);
    const goTrial = data.find(t => t.task === 'response' && t.correct_response === 'f');
    
    expect(goTrial).toBeDefined();
    expect(goTrial.response).toBe('f');
    expect(goTrial.correct).toBe(true);
    expect(goTrial.rt).toBeGreaterThan(0);
    expect(goTrial.rt).toBeLessThan(1000); // Within trial duration
  });
  
  test('should mark incorrect if wrong key pressed', async ({ page }) => {
    // Similar test with wrong key
  });
  
  test('should mark incorrect if no response', async ({ page }) => {
    // Test with no keypress
  });
});
```

### Example Test: Timing Accuracy

```javascript
// tests/performance/trial-timing.test.js
const { test, expect } = require('@playwright/test');

test.describe('Trial Timing Accuracy', () => {
  test('fixation duration should match specification', async ({ page }) => {
    await page.goto('/src/index.html');
    
    // Navigate to test trials
    // ... navigation code ...
    
    // Monitor console for timing logs
    const timingLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('Fixation duration:')) {
        timingLogs.push(msg.text());
      }
    });
    
    // Wait for multiple fixation trials
    await page.waitForTimeout(5000);
    
    // Verify durations are from allowed set
    const allowedDurations = [250, 500, 750, 1000, 1250, 1500, 1750, 2000];
    timingLogs.forEach(log => {
      const duration = parseInt(log.match(/\d+/)[0]);
      expect(allowedDurations).toContain(duration);
    });
  });
  
  test('stimulus duration should be 1000ms (standalone)', async ({ page }) => {
    // Measure actual stimulus duration
    const startTime = Date.now();
    await page.waitForSelector('img[src*="blue.png"]');
    await page.waitForSelector('img[src*="blue.png"]', { state: 'hidden' });
    const actualDuration = Date.now() - startTime;
    
    expect(actualDuration).toBeGreaterThanOrEqual(990);
    expect(actualDuration).toBeLessThanOrEqual(1010);
  });
});
```

## Test Execution Strategy

### Local Development
```bash
# Run all tests
npx playwright test

# Run specific test suite
npx playwright test tests/scientific/

# Run with UI mode
npx playwright test --ui

# Run in headed mode
npx playwright test --headed
```

### Continuous Integration
```bash
# Install browsers
npx playwright install --with-deps

# Run tests
npx playwright test

# Generate report
npx playwright show-report
```

## Test Data Requirements

### Mock Responses
- Valid Go responses (F key, '1' key)
- Invalid responses (wrong keys)
- No responses (for No-Go validation)
- Rapid responses (for RT testing)
- Delayed responses (for timeout testing)

### Test Scenarios
- All correct responses
- All incorrect responses
- Mixed correct/incorrect
- Edge cases (no responses, multiple responses)

## Validation Criteria

### Scientific Validity
- [ ] Go trials correctly require keypress
- [ ] No-Go trials correctly require withholding
- [ ] Accuracy calculation is correct
- [ ] Response times are measured accurately
- [ ] Stimuli are presented correctly

### Timing Accuracy
- [ ] Fixation durations match specification (±10ms)
- [ ] Stimulus durations match specification (±10ms)
- [ ] Timing sequences are fixed and reproducible
- [ ] Timing data stored correctly

### Data Integrity
- [ ] All required fields present
- [ ] Data structure is consistent
- [ ] No missing or null critical values
- [ ] Data export is valid JSON
- [ ] Trial count matches specification

### Behavioral Accuracy
- [ ] Responses recorded correctly
- [ ] Correctness calculated correctly
- [ ] RT measured accurately
- [ ] Edge cases handled properly

## Reporting

### Test Reports
- HTML reports with screenshots
- Video recordings of failures
- Console log captures
- Performance metrics
- Coverage reports

### Metrics to Track
- Test pass rate
- Timing accuracy statistics
- Response accuracy statistics
- Browser compatibility matrix
- Performance benchmarks

## Maintenance

### Regular Testing
- Run tests before each release
- Run tests after code changes
- Run tests in CI/CD pipeline
- Review and update tests quarterly

### Test Updates
- Update tests when task parameters change
- Add tests for new features
- Remove obsolete tests
- Refactor tests for maintainability

## Success Criteria

Tests are considered successful when:

1. **All scientific validity tests pass**: Task accurately measures response inhibition
2. **Timing accuracy within tolerance**: All timing tests pass within ±10ms
3. **Data integrity verified**: All data collection tests pass
4. **Cross-browser compatibility**: Tests pass on all target browsers
5. **Error handling validated**: All error cases handled gracefully
6. **Reproducibility confirmed**: Multiple runs produce identical results

## Timeline

### Phase 1: Setup (Week 1)
- Install Playwright and dependencies
- Set up test structure
- Create helper functions
- Configure test environment

### Phase 2: Core Tests (Week 2-3)
- Implement scientific validity tests
- Implement timing accuracy tests
- Implement data integrity tests
- Implement response handling tests

### Phase 3: Integration Tests (Week 4)
- Implement standalone version tests
- Implement Qualtrics version tests
- Implement MRI trigger tests
- Cross-browser testing

### Phase 4: Edge Cases & Polish (Week 5)
- Error handling tests
- Edge case tests
- Performance optimization
- Documentation

### Phase 5: CI/CD Integration (Week 6)
- Set up continuous integration
- Automated test execution
- Test reporting
- Maintenance procedures

## Resources

### Documentation
- Playwright Documentation: https://playwright.dev/
- jsPsych Documentation: https://www.jspsych.org/
- Testing Best Practices: Various cognitive task testing resources

### Tools
- Playwright Test Runner
- Playwright Inspector (debugging)
- Playwright Codegen (test generation)
- Browser DevTools (manual validation)

---

**Document Version**: 1.0  
**Created**: 2024  
**Status**: Ready for Implementation

