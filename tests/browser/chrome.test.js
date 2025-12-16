const { test, expect } = require('@playwright/test');
const {
    navigateInstructions,
    waitAndTriggerMRI,
    extractJsPsychData,
    waitForStimulus,
    pressKey
} = require('../../fixtures/helpers');

test.describe('Chrome Browser Compatibility', () => {
    test.use({ browserName: 'chromium' });
    
    test('should load experiment correctly', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await expect(page).toHaveTitle(/Welcome.*GNG/i);
        
        // Verify jsPsych loads
        const jsPsychLoaded = await page.evaluate(() => {
            return typeof window.jsPsych !== 'undefined' || typeof initJsPsych !== 'undefined';
        });
        
        expect(jsPsychLoaded).toBe(true);
    });
    
    test('should handle keyboard responses', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await waitForStimulus(page, 'blue.png');
        await pressKey(page, 'f');
        
        await page.waitForTimeout(1500);
        
        const data = await extractJsPsychData(page);
        expect(data).not.toBeNull();
    });
    
    test('should display stimuli correctly', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        // Should see either fixation or stimulus
        const hasContent = await page.locator('img, text=+').first().isVisible({ timeout: 5000 });
        expect(hasContent).toBe(true);
    });
});

