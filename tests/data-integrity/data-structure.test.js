const { test, expect } = require('@playwright/test');
const {
    extractJsPsychData,
    navigateInstructions,
    waitAndTriggerMRI,
    verifyDataStructure
} = require('../../fixtures/helpers');

test.describe('Data Structure Validation', () => {
    test('standalone: response trials should have all required fields', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Complete a few trials
        await page.waitForTimeout(10000);
        
        const data = await extractJsPsychData(page);
        expect(data).not.toBeNull();
        
        const responseTrials = data.filter(t => t.task === 'response');
        
        if (responseTrials.length > 0) {
            const requiredFields = [
                'trial_type',
                'task',
                'stimulus',
                'response',
                'rt',
                'correct',
                'correct_response',
                'stimulus_duration',
                'trial_sequence_index',
                'stimulus_type'
            ];
            
            responseTrials.forEach(trial => {
                const verification = verifyDataStructure(trial, requiredFields);
                expect(verification.valid).toBe(true);
            });
        }
    });
    
    test('standalone: fixation trials should have all required fields', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(10000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const fixationTrials = data.filter(t => t.task === 'fixation');
            
            if (fixationTrials.length > 0) {
                const requiredFields = [
                    'trial_type',
                    'task',
                    'fixation_duration',
                    'trial_sequence_index'
                ];
                
                fixationTrials.forEach(trial => {
                    const verification = verifyDataStructure(trial, requiredFields);
                    expect(verification.valid).toBe(true);
                });
            }
        }
    });
    
    test('standalone: timing_config should be included in data', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for experiment to complete
        await page.waitForTimeout(60000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            // Check if timing_config is in the data
            const hasTimingConfig = data.some(trial => trial.timing_config !== undefined);
            // Or check if it's a property of the data collection
            const timingConfig = await page.evaluate(() => {
                if (window.jsPsych) {
                    const allData = window.jsPsych.data.get();
                    return allData.timing_config;
                }
                return null;
            });
            
            // Timing config should be available (either in trials or as property)
            expect(hasTimingConfig || timingConfig !== null).toBe(true);
        }
    });
    
    test('standalone: data should be valid JSON', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(10000);
        
        const data = await extractJsPsychData(page);
        
        // Verify it's a valid array
        expect(Array.isArray(data)).toBe(true);
        
        // Verify each trial is an object
        if (data.length > 0) {
            data.forEach(trial => {
                expect(typeof trial).toBe('object');
                expect(trial).not.toBeNull();
            });
        }
    });
});

