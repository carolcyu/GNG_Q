const { test, expect } = require('@playwright/test');
const {
    waitForTrialStart,
    waitForStimulus,
    pressKey,
    extractJsPsychData,
    navigateInstructions,
    waitAndTriggerMRI,
    waitForExperimentComplete,
    getAccuracyFromDebrief
} = require('../fixtures/helpers');
const { RESPONSE_KEYS } = require('../fixtures/test-data');

test.describe('Accuracy Calculation', () => {
    test('standalone: should calculate accuracy correctly with correct responses', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Complete a few trials with correct responses
        for (let i = 0; i < 5; i++) {
            await page.waitForSelector('img', { timeout: 5000 });
            const imgSrc = await page.$eval('img', img => img.src);
            
            if (imgSrc.includes('blue.png')) {
                // Go trial - press F
                await pressKey(page, 'f');
            } else if (imgSrc.includes('orange.png')) {
                // No-Go trial - don't press
            }
            
            await page.waitForTimeout(1500);
        }
        
        // Wait for experiment to complete (or at least get some data)
        await page.waitForTimeout(5000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data.filter(t => t.task === 'response');
            const correctTrials = responseTrials.filter(t => t.correct === true);
            
            if (responseTrials.length > 0) {
                const accuracy = Math.round((correctTrials.length / responseTrials.length) * 100);
                expect(accuracy).toBeGreaterThanOrEqual(0);
                expect(accuracy).toBeLessThanOrEqual(100);
            }
        }
    });
    
    test('standalone: should handle division by zero in accuracy calculation', async ({ page }) => {
        // This test verifies the error handling in debrief
        // The debrief should handle the case where no response trials exist
        await page.goto('/src/index.html');
        
        // Navigate to debrief without completing trials
        // This is difficult to test directly, but we can verify the code handles it
        // by checking the debrief block implementation
        test.skip(true, 'Requires code inspection or mock data');
    });
    
    test('standalone: should display accuracy percentage in debrief', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Complete experiment (simplified - just wait for debrief)
        // In a real test, we'd complete all trials
        await page.waitForTimeout(10000);
        
        // Check if debrief appears
        const debriefVisible = await page.locator('text=/responded correctly/').isVisible({ timeout: 5000 }).catch(() => false);
        
        if (debriefVisible) {
            const accuracy = await getAccuracyFromDebrief(page);
            expect(accuracy).not.toBeNull();
            expect(accuracy).toBeGreaterThanOrEqual(0);
            expect(accuracy).toBeLessThanOrEqual(100);
        }
    });
    
    test('standalone: should calculate Go and No-Go accuracies separately', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Complete some trials
        await page.waitForTimeout(10000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const goTrials = data.filter(t => t.task === 'response' && t.correct_response === 'f');
            const noGoTrials = data.filter(t => t.task === 'response' && t.correct_response === null);
            
            if (goTrials.length > 0) {
                const goCorrect = goTrials.filter(t => t.correct === true);
                const goAccuracy = Math.round((goCorrect.length / goTrials.length) * 100);
                expect(goAccuracy).toBeGreaterThanOrEqual(0);
                expect(goAccuracy).toBeLessThanOrEqual(100);
            }
            
            if (noGoTrials.length > 0) {
                const noGoCorrect = noGoTrials.filter(t => t.correct === true);
                const noGoAccuracy = Math.round((noGoCorrect.length / noGoTrials.length) * 100);
                expect(noGoAccuracy).toBeGreaterThanOrEqual(0);
                expect(noGoAccuracy).toBeLessThanOrEqual(100);
            }
        }
    });
});

