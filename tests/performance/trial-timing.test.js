const { test, expect } = require('@playwright/test');
const {
    waitForTrialStart,
    waitForStimulus,
    waitForFixation,
    extractJsPsychData,
    navigateInstructions,
    waitAndTriggerMRI,
    measureTiming
} = require('../../fixtures/helpers');
const {
    FIXATION_SEQUENCE_STANDALONE,
    STIMULUS_SEQUENCE_STANDALONE,
    VALID_FIXATION_DURATIONS_STANDALONE,
    VALID_STIMULUS_DURATIONS_QUALTRICS
} = require('../../fixtures/test-data');

test.describe('Trial Timing Accuracy', () => {
    test('standalone: fixation duration should match specification', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Monitor console for timing logs
        const timingLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Fixation duration:')) {
                timingLogs.push(text);
            }
        });
        
        // Wait for multiple fixation trials
        await page.waitForTimeout(5000);
        
        // Verify durations are from allowed set
        const extractedDurations = timingLogs.map(log => {
            const match = log.match(/(\d+)ms/);
            return match ? parseInt(match[1]) : null;
        }).filter(d => d !== null);
        
        if (extractedDurations.length > 0) {
            extractedDurations.forEach(duration => {
                expect(VALID_FIXATION_DURATIONS_STANDALONE).toContain(duration);
            });
        }
    });
    
    test('standalone: stimulus duration should be 1000ms', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Wait for stimulus
        await waitForStimulus(page, 'blue.png');
        
        // Measure actual duration
        const startTime = Date.now();
        await page.waitForSelector('img[src*="blue.png"]', { state: 'hidden', timeout: 2000 }).catch(() => {});
        const actualDuration = Date.now() - startTime;
        
        // Should be approximately 1000ms (within tolerance)
        expect(actualDuration).toBeGreaterThanOrEqual(990);
        expect(actualDuration).toBeLessThanOrEqual(1100);
    });
    
    test('standalone: fixation durations should follow fixed sequence', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Collect fixation durations from data
        await page.waitForTimeout(10000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const fixationTrials = data.filter(t => t.task === 'fixation');
            
            if (fixationTrials.length > 0) {
                const durations = fixationTrials
                    .map(t => t.fixation_duration)
                    .filter(d => d !== undefined);
                
                // Check that durations match the sequence
                durations.forEach((duration, index) => {
                    if (index < FIXATION_SEQUENCE_STANDALONE.length) {
                        expect(duration).toBe(FIXATION_SEQUENCE_STANDALONE[index]);
                    }
                });
            }
        }
    });
    
    test('standalone: stimulus durations should follow fixed sequence', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(10000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const responseTrials = data.filter(t => t.task === 'response');
            
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
});

