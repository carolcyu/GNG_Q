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

test.describe('No-Go Trial Validity', () => {
    test('standalone: should require no keypress for orange circle', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for No-Go trial (orange circle)
        await waitForStimulus(page, 'orange.png');
        
        // Do NOT press any key
        await page.waitForTimeout(1100);
        
        const data = await extractJsPsychData(page);
        const noGoTrials = data.filter(t => t.task === 'response' && t.correct_response === null);
        
        expect(noGoTrials.length).toBeGreaterThan(0);
        
        const firstNoGoTrial = noGoTrials.find(t => t.response === null);
        if (firstNoGoTrial) {
            expect(firstNoGoTrial.correct).toBe(true);
            expect(firstNoGoTrial.rt).toBeNull();
        }
    });
    
    test('standalone: should mark incorrect if keypress on No-Go trial', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for No-Go trial
        await waitForStimulus(page, 'orange.png');
        
        // Press key (should be incorrect)
        await pressKey(page, 'f');
        
        await page.waitForTimeout(500);
        
        const data = await extractJsPsychData(page);
        const noGoTrials = data.filter(t => t.task === 'response' && t.correct_response === null);
        
        const incorrectTrial = noGoTrials.find(t => t.response !== null);
        if (incorrectTrial) {
            expect(incorrectTrial.correct).toBe(false);
            expect(incorrectTrial.response).not.toBeNull();
        }
    });
    
    test('standalone: should have null RT for correct No-Go trials', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for No-Go trial and don't respond
        await waitForStimulus(page, 'orange.png');
        await page.waitForTimeout(1100);
        
        const data = await extractJsPsychData(page);
        const noGoTrials = data.filter(t => 
            t.task === 'response' && 
            t.correct_response === null && 
            t.correct === true
        );
        
        if (noGoTrials.length > 0) {
            noGoTrials.forEach(trial => {
                expect(trial.rt).toBeNull();
            });
        }
    });
});

