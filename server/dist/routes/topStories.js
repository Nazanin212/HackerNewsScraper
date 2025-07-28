"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playwright_1 = require("playwright");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    const browser = await playwright_1.chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://news.ycombinator.com/');
        const stories = await page.$$eval('.athing', (elements) => {
            return elements.map((el) => {
                const titleLink = el.querySelector('.titleline > a');
                const subtextRow = el.nextElementSibling;
                const score = subtextRow?.querySelector('.score')?.textContent || '';
                const user = subtextRow?.querySelector('.hnuser')?.textContent || '';
                const commentsLink = Array.from(subtextRow?.querySelectorAll('a') || []).find(a => a.textContent?.includes('comment'));
                const comments = commentsLink?.textContent || '';
                return {
                    title: titleLink?.textContent?.trim() || '',
                    url: titleLink?.getAttribute('href') || '',
                    score,
                    user,
                    comments,
                };
            });
        });
        res.json(stories);
    }
    catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
    finally {
        await browser.close();
    }
});
exports.default = router;
