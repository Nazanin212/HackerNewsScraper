"use strict";
/// <reference lib="dom" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeArticles = void 0;
const playwright_1 = require("playwright");
async function scrapeArticles() {
    const browser = await playwright_1.chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com/newest');
    const articles = await page.$$eval('tr.athing', rows => rows.map(row => {
        const id = row.getAttribute('id');
        const title = row.querySelector('.titleline a')?.textContent || '';
        const url = row.querySelector('.titleline a')?.getAttribute('href') || '';
        return { id, title, url };
    }));
    await browser.close();
    return articles;
}
exports.scrapeArticles = scrapeArticles;
/*
 * Function sortHackerNewsArticles
 * Validates that first 100 articles on Hacker News/newest
 * are sorted from newest to oldest.
 */
async function sortHackerNewsArticles() {
    //Generate an array of the first 100 IDs and verify sorted
    // launch browser
    const browser = await playwright_1.chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");
    let ids = [];
    let firstHundredIDs = [];
    let idsOnPage = [];
    // loop until we find the first 100 Ids 
    while (true) {
        idsOnPage = await page.$$eval('tr.athing', els => els.map(e => e.id));
        ids.push(...idsOnPage);
        if (ids.length >= 100) {
            break;
        }
        await page.click('a.morelink');
    }
    // Verify sorted
    firstHundredIDs = ids.splice(0, 100);
    console.log(firstHundredIDs.every((val, i, arr) => i === 0 || val <= arr[i - 1]));
    await browser.close();
}
(async () => {
    await sortHackerNewsArticles();
})();
