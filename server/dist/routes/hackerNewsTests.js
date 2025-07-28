"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playwright_1 = require("playwright");
const db_1 = require("../db");
const router = express_1.default.Router();
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache lifetime
// Helper: Launch browser
async function launchBrowser() {
    return await playwright_1.chromium.launch();
}
// Newest articles sorted check //
async function checkNewestArticlesSorted(browser) {
    const test_id = 'new-sort-check';
    const test_name = 'New Articles';
    const test_description = 'Verify exactly the first 100 newest articles are sorted';
    console.log(`Running ${test_id} ...`);
    const page = await browser.newPage();
    try {
        await page.goto('https://news.ycombinator.com/newest');
        const timestamps = await page.$$eval('.subtext > span.age', (spans) => spans.map(span => span.getAttribute('title')));
        const parsedTimes = timestamps
            .slice(0, 100)
            .map(t => (t ? new Date(t).getTime() : 0));
        const passed = parsedTimes.every((time, i) => i === 0 || time <= parsedTimes[i - 1]);
        console.log(`${test_id} returned: ${passed}!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: passed ? 'Passed' : 'Failed',
            lastRun: new Date().toISOString(),
            details: passed ? 'Articles are sorted correctly' : 'Articles are not sorted',
        };
    }
    catch (e) {
        console.log(`${test_id} errored: ${e.message}}!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Failed',
            lastRun: new Date().toISOString(),
            details: e.message,
        };
    }
    finally {
        await page.close();
    }
}
// Basic navigation flow //
async function testNavFlow(browser) {
    const test_id = 'navigation-flow';
    const test_name = 'Navigation Flow Test';
    const test_description = 'Verify you can click the first article and comments';
    console.log(`Running ${test_id} ...`);
    const page = await browser.newPage();
    let currentUrl = "";
    try {
        await page.goto('https://news.ycombinator.com');
        // Verify click first article works
        const articleLink = page.locator('span.titleline > a').first();
        if (await articleLink.count() === 0) {
            throw new Error('No article link found');
        }
        await Promise.all([
            page.waitForLoadState('domcontentloaded'),
            articleLink.click(),
        ]);
        currentUrl = page.url();
        if (currentUrl.includes('ycombinator')) {
            throw new Error('Article click did not navigate to new page');
        }
        await page.goBack({ waitUntil: 'domcontentloaded' });
        // Verify clicking on comments navigates to comments page
        const commentsLink = page.locator('span.subline > a:has-text("comments")').first();
        await Promise.all([
            page.waitForLoadState('domcontentloaded'),
            commentsLink.click(),
        ]);
        currentUrl = page.url();
        if (!currentUrl.includes('news.ycombinator.com/item?id=')) {
            throw new Error('Could not click on comments');
        }
        console.log(`${test_id} returned: passed!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Passed',
            lastRun: new Date().toISOString(),
            details: 'Basic navigation workflow ran sucessfully',
        };
    }
    catch (e) {
        console.log(`${test_id} errored: ${e.message}}!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Failed',
            lastRun: new Date().toISOString(),
            details: e.message,
        };
    }
    finally {
        await page.close();
    }
}
// Performance smoke check //
async function testPerformance(browser) {
    const test_id = 'performance-smoke';
    const test_name = 'Performance Smoke Test';
    const test_description = 'Verify page loads within 2 seconds';
    console.log(`Running ${test_id} ...`);
    const page = await browser.newPage();
    try {
        const start = Date.now();
        await page.goto('https://news.ycombinator.com');
        const ms = Date.now() - start;
        if (ms > 2000)
            throw new Error('Page took longer than 2ms to load');
        console.log(`${test_id} returned: passed!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Passed',
            lastRun: new Date().toISOString(),
            details: `Load time: ${ms}ms`,
        };
    }
    catch (e) {
        console.log(`${test_id} errored: ${e.message}}!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Failed',
            lastRun: new Date().toISOString(),
            details: e.message,
        };
    }
    finally {
        await page.close();
    }
}
// Top story API works //
// https://github.com/HackerNews/API?tab=readme-ov-file
async function API_GetTopStories() {
    const test_id = 'api-top-stories';
    const test_name = 'GET API Top Stories';
    const test_description = 'Verify HackerNews GET API works for correctly for top stories';
    console.log(`Running ${test_id} ...`);
    const apiContext = await playwright_1.request.newContext();
    try {
        // GET all the top stories 
        const topStoriesRes = await apiContext.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStoryIds = await topStoriesRes.json();
        // Retrieve the json for the first story
        const firstStoryId = topStoryIds[0];
        const storyRes = await apiContext.get(`https://hacker-news.firebaseio.com/v0/item/${firstStoryId}.json`);
        const story = await storyRes.json();
        // Verify json is valid with logging info
        let details = '';
        let passed = true;
        if (firstStoryId !== story.id) {
            details = details + 'Story ID mismatch ';
            passed = false;
        }
        if (!story.title || story.title.length === 0) {
            details = details + 'Missing or empty title ';
            passed = false;
        }
        if (!story.by || story.by.length === 0) {
            details = details + 'Missing or empty author ';
            passed = false;
        }
        if (!story.url || story.url.length === 0) {
            details = details + 'Missing or empty URL ';
            passed = false;
        }
        if (passed === false)
            throw new Error(details);
        console.log(`${test_id} returned: passed!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Passed',
            lastRun: new Date().toISOString(),
            details: 'Test run successfully',
        };
    }
    catch (e) {
        console.log(`${test_id} errored: ${e.message}}!`);
        return {
            id: test_id,
            name: test_name,
            description: test_description,
            status: 'Failed',
            lastRun: new Date().toISOString(),
            details: e.message,
        };
    }
}
// Run all tests (no streaming)
async function runAllTests(onProgress) {
    console.log("	Running all tests ...");
    const browser = await launchBrowser();
    try {
        const results = [];
        const tests = [
            checkNewestArticlesSorted,
            testNavFlow,
            testPerformance,
        ];
        for (const testFn of tests) {
            const result = await testFn(browser);
            (0, db_1.saveTestResult)(result); // Cache it
            results.push(result);
            onProgress?.(`Completed test: ${result.name}`);
        }
        const apiTestResults = await API_GetTopStories();
        (0, db_1.saveTestResult)(apiTestResults);
        results.push(apiTestResults);
        onProgress?.(`Completed test: ${apiTestResults.name}`);
        console.log(`	Tests complete, results cached!`);
        return results;
    }
    catch (error) {
        console.error('There was as issue', error);
    }
    finally {
        await browser.close();
    }
}
// Get all test results (runs all tests fresh)
router.get('/', async (_req, res) => {
    try {
        console.log("[ROUTES] Checking cashed test results ...");
        const now = Date.now();
        const cachedResults = (0, db_1.getCachedTestResults)();
        if (cachedResults.length > 0 && now - lastCacheTime < CACHE_TTL) {
            console.log('	Serving cached test results');
            return res.json(cachedResults);
        }
        console.log('[ROUTES] Cache expired or empty, running tests fresh');
        const results = await runAllTests();
        lastCacheTime = now;
        return res.json(results);
    }
    catch (error) {
        console.error('[ROUTES] Failed to run or get tests:', error);
        res.status(500).json({ error: 'Failed to run tests' });
    }
});
exports.default = router;
