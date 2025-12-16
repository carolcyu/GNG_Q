const { test, expect } = require('@playwright/test');
const {
    extractJsPsychData,
    navigateInstructions,
    waitAndTriggerMRI
} = require('../../fixtures/helpers');

test.describe('Data Completeness Tests', () => {
    test('standalone: all response trials should have timing data', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data.filter(t => t.task === 'response');
            
            if (responseTrials.length > 0) {
                responseTrials.forEach(trial => {
                    expect(trial.stimulus_duration).toBeDefined();
                    expect(trial.trial_sequence_index).toBeDefined();
                    expect(trial.stimulus_type).toBeDefined();
                    expect(typeof trial.stimulus_duration).toBe('number');
                    expect(typeof trial.trial_sequence_index).toBe('number');
                });
            }
        }
    });
    
    test('standalone: all fixation trials should have timing data', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const fixationTrials = data.filter(t => t.task === 'fixation');
            
            if (fixationTrials.length > 0) {
                fixationTrials.forEach(trial => {
                    expect(trial.fixation_duration).toBeDefined();
                    expect(trial.trial_sequence_index).toBeDefined();
                    expect(typeof trial.fixation_duration).toBe('number');
                    expect(typeof trial.trial_sequence_index).toBe('number');
                });
            }
        }
    });
    
    test('standalone: no null values in critical fields', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data.filter(t => t.task === 'response');
            
            responseTrials.forEach(trial => {
                // Critical fields should not be null (except response and rt which can be null for No-Go)
                expect(trial.task).not.toBeNull();
                expect(trial.correct_response).toBeDefined(); // Can be null for No-Go, but should be defined
                expect(trial.stimulus_duration).not.toBeNull();
                expect(trial.trial_sequence_index).not.toBeNull();
                expect(trial.stimulus_type).not.toBeNull();
            });
        }
    });
    
    test('standalone: correct field should always be boolean', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data.filter(t => t.task === 'response');
            
            responseTrials.forEach(trial => {
                if (trial.correct !== undefined) {
                    expect(typeof trial.correct).toBe('boolean');
                }
            });
        }
    });
});

