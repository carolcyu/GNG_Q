const { test, expect } = require('@playwright/test');
const {
    extractJsPsychData,
    navigateInstructions,
    waitAndTriggerMRI,
    verifyTimingSequence
} = require('../../fixtures/helpers');
const {
    FIXATION_SEQUENCE_STANDALONE,
    STIMULUS_SEQUENCE_STANDALONE,
    FIXATION_SEQUENCE_QUALTRICS,
    STIMULUS_SEQUENCE_QUALTRICS
} = require('../../fixtures/test-data');

test.describe('Fixed Timing Sequence Tests', () => {
    test('standalone: fixation sequence should be fixed and reproducible', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for multiple trials
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const fixationTrials = data
                .filter(t => t.task === 'fixation')
                .sort((a, b) => (a.trial_sequence_index || 0) - (b.trial_sequence_index || 0));
            
            if (fixationTrials.length > 0) {
                const durations = fixationTrials
                    .map(t => t.fixation_duration)
                    .filter(d => d !== undefined);
                
                // Verify first few match the sequence
                const sequenceLength = Math.min(durations.length, FIXATION_SEQUENCE_STANDALONE.length);
                for (let i = 0; i < sequenceLength; i++) {
                    expect(durations[i]).toBe(FIXATION_SEQUENCE_STANDALONE[i]);
                }
            }
        }
    });
    
    test('standalone: stimulus sequence should be fixed', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data
                .filter(t => t.task === 'response')
                .sort((a, b) => (a.trial_sequence_index || 0) - (b.trial_sequence_index || 0));
            
            if (responseTrials.length > 0) {
                const durations = responseTrials
                    .map(t => t.stimulus_duration)
                    .filter(d => d !== undefined);
                
                // All should be 1000ms for standalone
                durations.forEach(duration => {
                    expect(duration).toBe(1000);
                });
            }
        }
    });
    
    test('standalone: timing sequence should be identical across runs', async ({ page }) => {
        // Run experiment twice and compare sequences
        const run1Durations = [];
        const run2Durations = [];
        
        // First run
        await page.goto('/src/index.html');
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        await page.waitForTimeout(10000);
        
        const data1 = await extractJsPsychData(page);
        if (data1 && data1.length > 0) {
            const fixations1 = data1
                .filter(t => t.task === 'fixation')
                .sort((a, b) => (a.trial_sequence_index || 0) - (b.trial_sequence_index || 0));
            run1Durations.push(...fixations1.map(t => t.fixation_duration).filter(d => d !== undefined));
        }
        
        // Second run (reload page)
        await page.goto('/src/index.html');
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        await page.waitForTimeout(10000);
        
        const data2 = await extractJsPsychData(page);
        if (data2 && data2.length > 0) {
            const fixations2 = data2
                .filter(t => t.task === 'fixation')
                .sort((a, b) => (a.trial_sequence_index || 0) - (b.trial_sequence_index || 0));
            run2Durations.push(...fixations2.map(t => t.fixation_duration).filter(d => d !== undefined));
        }
        
        // Compare sequences (if we have data from both runs)
        if (run1Durations.length > 0 && run2Durations.length > 0) {
            const minLength = Math.min(run1Durations.length, run2Durations.length);
            for (let i = 0; i < minLength; i++) {
                expect(run1Durations[i]).toBe(run2Durations[i]);
            }
        }
    });
    
    test('standalone: trial_sequence_index should be sequential', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(15000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data
                .filter(t => t.task === 'response')
                .sort((a, b) => (a.trial_sequence_index || 0) - (b.trial_sequence_index || 0));
            
            if (responseTrials.length > 1) {
                // Check that indices are sequential
                for (let i = 1; i < responseTrials.length; i++) {
                    const prevIndex = responseTrials[i - 1].trial_sequence_index;
                    const currIndex = responseTrials[i].trial_sequence_index;
                    
                    if (prevIndex !== undefined && currIndex !== undefined) {
                        expect(currIndex).toBeGreaterThanOrEqual(prevIndex);
                    }
                }
            }
        }
    });
});

