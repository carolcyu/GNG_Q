/**
 * Test Helper Functions for GNG Task Testing
 */

/**
 * Wait for trial to start
 * @param {import('@playwright/test').Page} page
 */
async function waitForTrialStart(page) {
    await page.waitForSelector('.jspsych-content', { state: 'visible', timeout: 10000 });
}

/**
 * Wait for stimulus image to appear
 * @param {import('@playwright/test').Page} page
 * @param {string} imagePath - Path to image (e.g., 'blue.png' or 'orange.png')
 */
async function waitForStimulus(page, imagePath) {
    await page.waitForSelector(`img[src*="${imagePath}"]`, { state: 'visible', timeout: 5000 });
}

/**
 * Wait for fixation cross to appear
 * @param {import('@playwright/test').Page} page
 */
async function waitForFixation(page) {
    await page.waitForSelector('text=+', { state: 'visible', timeout: 5000 });
}

/**
 * Simulate keypress
 * @param {import('@playwright/test').Page} page
 * @param {string} key - Key to press (e.g., 'f', '1', '5')
 */
async function pressKey(page, key) {
    await page.keyboard.press(key);
}

/**
 * Get console logs matching a pattern
 * @param {import('@playwright/test').Page} page
 * @param {string} pattern - Pattern to match in console logs
 * @returns {Promise<Array<string>>}
 */
async function getConsoleLogs(page, pattern) {
    const logs = [];
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes(pattern)) {
            logs.push(text);
        }
    });
    return logs;
}

/**
 * Extract jsPsych data from page
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array>}
 */
async function extractJsPsychData(page) {
    return await page.evaluate(() => {
        if (typeof window !== 'undefined' && window.jsPsych) {
            return window.jsPsych.data.get().json();
        }
        return null;
    });
}

/**
 * Measure timing accuracy
 * @param {import('@playwright/test').Page} page
 * @param {number} expectedDuration - Expected duration in ms
 * @param {number} tolerance - Tolerance in ms (default: 10)
 * @returns {Promise<boolean>}
 */
async function measureTiming(page, expectedDuration, tolerance = 10) {
    const startTime = Date.now();
    await page.waitForTimeout(expectedDuration);
    const actualDuration = Date.now() - startTime;
    const difference = Math.abs(actualDuration - expectedDuration);
    return difference <= tolerance;
}

/**
 * Navigate through instruction screens
 * @param {import('@playwright/test').Page} page
 * @param {string} version - 'standalone' or 'qualtrics'
 */
async function navigateInstructions(page, version) {
    if (version === 'standalone') {
        // Standalone uses button clicks
        await page.click('text=NEXT');
        await page.waitForTimeout(500);
        await page.click('text=NEXT');
        await page.waitForTimeout(500);
        await page.click('text=NEXT');
        await page.waitForTimeout(500);
        await page.click('text=NEXT');
        await page.waitForTimeout(1000);
    } else {
        // Qualtrics uses keyboard
        await page.keyboard.press('Space');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Space');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Space');
        await page.waitForTimeout(1000);
    }
}

/**
 * Wait for MRI trigger screen and simulate trigger
 * @param {import('@playwright/test').Page} page
 */
async function waitAndTriggerMRI(page) {
    // Wait for MRI start screen
    await page.waitForSelector('text=scanner', { timeout: 10000 });
    await page.waitForTimeout(1000);
    // Press key '5' to trigger
    await page.keyboard.press('5');
    await page.waitForTimeout(500);
}

/**
 * Get trial data by task type
 * @param {import('@playwright/test').Page} page
 * @param {string} taskType - 'response', 'fixation', or 'mri_start'
 * @returns {Promise<Array>}
 */
async function getTrialsByTask(page, taskType) {
    const allData = await extractJsPsychData(page);
    if (!allData) return [];
    return allData.filter(trial => trial.task === taskType);
}

/**
 * Verify timing sequence matches expected
 * @param {Array<number>} actualSequence - Actual timing sequence from data
 * @param {Array<number>} expectedSequence - Expected timing sequence
 * @param {number} tolerance - Tolerance in ms
 * @returns {boolean}
 */
function verifyTimingSequence(actualSequence, expectedSequence, tolerance = 10) {
    if (actualSequence.length !== expectedSequence.length) {
        return false;
    }
    for (let i = 0; i < actualSequence.length; i++) {
        if (Math.abs(actualSequence[i] - expectedSequence[i]) > tolerance) {
            return false;
        }
    }
    return true;
}

/**
 * Wait for experiment to complete
 * @param {import('@playwright/test').Page} page
 * @param {number} maxWait - Maximum wait time in ms
 */
async function waitForExperimentComplete(page, maxWait = 300000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
        const isComplete = await page.evaluate(() => {
            if (typeof window !== 'undefined' && window.jsPsych) {
                return window.jsPsych.getProgress().percent_complete >= 1.0;
            }
            return false;
        });
        if (isComplete) {
            return;
        }
        await page.waitForTimeout(1000);
    }
    throw new Error('Experiment did not complete within timeout');
}

/**
 * Check if element is visible
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @returns {Promise<boolean>}
 */
async function isElementVisible(page, selector) {
    try {
        await page.waitForSelector(selector, { state: 'visible', timeout: 1000 });
        return true;
    } catch {
        return false;
    }
}

/**
 * Get accuracy from debrief screen
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number|null>}
 */
async function getAccuracyFromDebrief(page) {
    const text = await page.textContent('.jspsych-content');
    if (!text) return null;
    const match = text.match(/(\d+)%/);
    return match ? parseInt(match[1]) : null;
}

/**
 * Verify data structure
 * @param {Object} trial - Trial data object
 * @param {Array<string>} requiredFields - Required field names
 * @returns {Object} - { valid: boolean, missing: Array<string> }
 */
function verifyDataStructure(trial, requiredFields) {
    const missing = [];
    for (const field of requiredFields) {
        if (!(field in trial)) {
            missing.push(field);
        }
    }
    return {
        valid: missing.length === 0,
        missing: missing
    };
}

module.exports = {
    waitForTrialStart,
    waitForStimulus,
    waitForFixation,
    pressKey,
    getConsoleLogs,
    extractJsPsychData,
    measureTiming,
    navigateInstructions,
    waitAndTriggerMRI,
    getTrialsByTask,
    verifyTimingSequence,
    waitForExperimentComplete,
    isElementVisible,
    getAccuracyFromDebrief,
    verifyDataStructure
};

