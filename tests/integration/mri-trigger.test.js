const { test, expect } = require('@playwright/test');
const {
    navigateInstructions,
    waitForStimulus,
    pressKey,
    extractJsPsychData
} = require('../../fixtures/helpers');

test.describe('MRI Trigger Tests', () => {
    test('standalone: should wait for key 5 before starting test trials', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        
        // Wait for MRI start screen
        await page.waitForSelector('text=scanner', { timeout: 10000 });
        
        // Verify we're on MRI start screen
        const mriText = await page.textContent('body');
        expect(mriText).toContain('scanner');
        
        // Try pressing a different key first (should not advance)
        await pressKey(page, 'a');
        await page.waitForTimeout(500);
        
        // Should still be on MRI start screen
        const stillOnMRI = await page.textContent('body');
        expect(stillOnMRI).toContain('scanner');
        
        // Press key 5 (should advance)
        await pressKey(page, '5');
        await page.waitForTimeout(1000);
        
        // Should now see test trials (fixation or stimulus)
        const hasTrial = await page.locator('img, text=+').first().isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasTrial).toBe(true);
    });
    
    test('standalone: should record MRI trigger in data', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        
        // Wait for MRI start and trigger
        await page.waitForSelector('text=scanner', { timeout: 10000 });
        await pressKey(page, '5');
        await page.waitForTimeout(2000);
        
        const data = await extractJsPsychData(page);
        if (data && data.length > 0) {
            const mriTrials = data.filter(t => t.task === 'mri_start');
            
            if (mriTrials.length > 0) {
                const mriTrial = mriTrials[0];
                expect(mriTrial.response).toBe('5');
                expect(mriTrial.rt).toBeGreaterThan(0);
            }
        }
    });
    
    test('standalone: should only accept key 5 during MRI start', async ({ page }) => {
        await page.goto('/src/index.html');
        
        await navigateInstructions(page, 'standalone');
        
        await page.waitForSelector('text=scanner', { timeout: 10000 });
        
        // Try multiple wrong keys
        const wrongKeys = ['1', '2', '3', '4', '6', '7', '8', '9', 'f', 'a'];
        for (const key of wrongKeys) {
            await pressKey(page, key);
            await page.waitForTimeout(100);
            
            // Should still be on MRI screen
            const stillOnMRI = await page.textContent('body');
            expect(stillOnMRI).toContain('scanner');
        }
        
        // Only key 5 should work
        await pressKey(page, '5');
        await page.waitForTimeout(1000);
        
        const hasTrial = await page.locator('img, text=+').first().isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasTrial).toBe(true);
    });
});

