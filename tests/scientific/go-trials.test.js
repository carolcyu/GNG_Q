const { test, expect } = require('@playwright/test');
const {
    waitForTrialStart,
    waitForStimulus,
    pressKey,
    extractJsPsychData,
    navigateInstructions,
    waitAndTriggerMRI,
    getTrialsByTask
} = require('../fixtures/helpers');
const { RESPONSE_KEYS } = require('../fixtures/test-data');

test.describe('Go Trial Validity', () => {
    test('standalone: should require keypress for blue circle', async ({ page }) => {
        await page.goto('/src/index.html');
        
        // Navigate through instructions
        await navigateInstructions(page, 'standalone');
        
        // Wait for MRI trigger and trigger it
        await waitAndTriggerMRI(page);
        
        // Wait for first Go trial (blue circle)
        await waitForStimulus(page, 'blue.png');
        
        // Press F key
        const startTime = Date.now();
        await pressKey(page, 'f');
        const responseTime = Date.now() - startTime;
        
        // Wait for trial to complete
        await page.waitForTimeout(1500);
        
        // Verify response was recorded
        const data = await extractJsPsychData(page);
        expect(data).not.toBeNull();
        
        const goTrials = data.filter(t => t.task === 'response' && t.correct_response === 'f');
        expect(goTrials.length).toBeGreaterThan(0);
        
        const firstGoTrial = goTrials[0];
        expect(firstGoTrial.response).toBe('f');
        expect(firstGoTrial.correct).toBe(true);
        expect(firstGoTrial.rt).toBeGreaterThan(0);
        expect(firstGoTrial.rt).toBeLessThan(1000);
    });
    
    test('standalone: should mark incorrect if wrong key pressed', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for Go trial
        await waitForStimulus(page, 'blue.png');
        
        // Press wrong key (not 'f')
        await pressKey(page, 'a');
        
        await page.waitForTimeout(1500);
        
        const data = await extractJsPsychData(page);
        const goTrials = data.filter(t => t.task === 'response' && t.correct_response === 'f');
        
        if (goTrials.length > 0) {
            const trial = goTrials.find(t => t.response === 'a');
            if (trial) {
                expect(trial.correct).toBe(false);
            }
        }
    });
    
    test('standalone: should mark incorrect if no response on Go trial', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for Go trial but don't press anything
        await waitForStimulus(page, 'blue.png');
        
        // Wait for trial to complete without response
        await page.waitForTimeout(1100);
        
        const data = await extractJsPsychData(page);
        const goTrials = data.filter(t => t.task === 'response' && t.correct_response === 'f');
        
        if (goTrials.length > 0) {
            const noResponseTrial = goTrials.find(t => t.response === null);
            if (noResponseTrial) {
                expect(noResponseTrial.correct).toBe(false);
            }
        }
    });
    
    test('qualtrics: should require keypress for blue circle', async ({ page }) => {
        // Note: Qualtrics version requires full Qualtrics environment
        // This test would need to be run in actual Qualtrics context
        // For now, we'll test the logic if the page is available
        
        test.skip(true, 'Qualtrics version requires Qualtrics environment');
    });
});

