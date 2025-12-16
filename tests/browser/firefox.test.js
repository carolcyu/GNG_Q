const { test, expect } = require('@playwright/test');
const {
    navigateInstructions,
    waitAndTriggerMRI,
    extractJsPsychData
} = require('../../fixtures/helpers');

test.describe('Firefox Browser Compatibility', () => {
    test.use({ browserName: 'firefox' });
    
    test('should load experiment correctly', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await expect(page).toHaveTitle(/Welcome.*GNG/i);
    });
    
    test('should handle keyboard responses', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        await waitAndTriggerMRI(page);
        
        await page.waitForTimeout(5000);
        
        const data = await extractJsPsychData(page);
        expect(data).not.toBeNull();
    });
});

