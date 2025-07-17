import express, { Request, Response } from 'express';
import { chromium, Browser, Page, Response as PlaywrightResponse } from 'playwright';
import { saveTestResult, getCachedTestResults, TestResult } from '../db';

const router = express.Router();

let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache lifetime

interface BrokenLink {
  url: string;
  error?: string;
}

// Helper: Launch browser
async function launchBrowser(): Promise<Browser> {
  return await chromium.launch();
}

// Test 1: Newest articles sorted check
async function checkNewestArticlesSorted(browser: Browser): Promise<TestResult> {
  const page: Page = await browser.newPage();

  try {
    await page.goto('https://news.ycombinator.com/newest');

    const timestamps: (string | null)[] = await page.$$eval(
      '.subtext > span.age',
      (spans: HTMLElement[]) => spans.map(span => span.getAttribute('title'))
    );

    const parsedTimes: number[] = timestamps
      .slice(0, 100)
      .map(t => (t ? new Date(t).getTime() : 0));

    const isSorted = parsedTimes.every((time, i) => i === 0 || time <= parsedTimes[i - 1]);

    return {
      id: 'new-sort-check',
      name: 'New Articles',
      description: 'Validates that exactly the first 100 newest articles are sorted from newest to oldest',
      status: isSorted ? 'Passed' : 'Failed',
      lastRun: new Date().toISOString(),
      details: isSorted ? 'Articles are sorted correctly' : 'Articles are not sorted',
    };
  } finally {
    await page.close();
  }
}

// ✅ Test 2: Navigation flow (click first article, comments)
async function testNavFlow(browser: Browser): Promise<TestResult> {
const page = await browser.newPage();
try {
    await page.goto('https://news.ycombinator.com');
    const firstLink = await page.getAttribute('a.storylink, a.titlelink', 'href');
    if (!firstLink) throw new Error('No article link found');
    const [newPg] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('a.storylink, a.titlelink'),
    ]);
    await newPg.waitForLoadState('domcontentloaded');
    await newPg.close();
    return {
    id: 'navigation-flow',
    name: 'Navigation Flow Test',
    description: 'Click through first article and close tab.',
    status: 'Passed',
    lastRun: new Date().toISOString(),
    details: 'Ran Successfully',
    };
} catch (e) {
    return {
    id: 'navigation-flow',
    name: 'Navigation Flow Test',
    description: 'Click through first article and close tab.',
    status: 'Failed',
    lastRun: new Date().toISOString(),
    details: (e as Error).message,
    };
} finally {
    await page.close();
}
}

// ✅ Test 3: Performance smoke check
async function testPerformance(browser: Browser): Promise<TestResult> {
const page = await browser.newPage();
try {
    const start = Date.now();
    await page.goto('https://news.ycombinator.com');
    const ms = Date.now() - start;
    const ok = ms < 2000;
    return {
    id: 'performance-smoke',
    name: 'Performance Smoke Test',
    description: 'Page loads within 2 seconds.',
    status: ok ? 'Passed' : 'Failed',
    lastRun: new Date().toISOString(),
    details: `Load time: ${ms}ms`,
    };
} catch (e) {
    return {
    id: 'performance-smoke',
    name: 'Performance Smoke Test',
    description: 'Page loads within 2 seconds.',
    status: 'Failed',
    lastRun: new Date().toISOString(),
    details: (e as Error).message,
    };
} finally {
    await page.close();
}
}

// ✅ Test 4: Duplicate title detection
async function testNoDuplicates(browser: Browser): Promise<TestResult> {
const page = await browser.newPage();
try {
    await page.goto('https://news.ycombinator.com');
    const titles = await page.$$eval('.storylink, .titlelink', els =>
    (els as HTMLElement[]).map(el => el.textContent?.trim() || '')
    );
    const dupes = titles.some((t,i) => t && titles.indexOf(t) !== i);
    return {
    id: 'dupe-title-check',
    name: 'Duplicate Title Test',
    description: 'Homepage titles contain no duplicates.',
    status: dupes ? 'Failed' : 'Passed',
    lastRun: new Date().toISOString(),
    details: dupes ? 'Duplicate titles found.' : '',
    };
} finally {
    await page.close();
}
}

// ✅ Test 5: Accessibility snapshot
async function testA11y(browser: Browser): Promise<TestResult> {
const page = await browser.newPage();
try {
    await page.goto('https://news.ycombinator.com');
    const snapshot = await page.accessibility.snapshot();
    if (!snapshot) throw new Error('No accessibility snapshot');
    return {
    id: 'a11y-snapshot',
    name: 'Accessibility Snapshot',
    description: '',
    status: 'Passed',
    lastRun: new Date().toISOString(),
    details: 'Ran Successfully',
    };
} catch (e) {
    return {
    id: 'a11y-snapshot',
    name: 'Accessibility Snapshot',
    description: '',
    status: 'Failed',
    lastRun: new Date().toISOString(),
    details: (e as Error).message,
    };
} finally {
    await page.close();
}
}

// ✅ Test 6: Full site link check (streamable)
async function testAllLinks(browser: Browser, onProgress?: (msg: string) => void): Promise<TestResult> {
const page = await browser.newPage();
try {
    await page.goto('https://news.ycombinator.com');
    const links: string[] = await page.$$eval('a[href]', els =>
    Array.from(new Set((els as HTMLElement[]).map(el => (el as HTMLAnchorElement).href)))
    );
    await page.close();

    const broken: string[] = [];
    const pool = await Promise.all(new Array(5).fill(null).map(() => browser.newPage()));

    for (let i = 0; i < links.length; i++) {
    const lnk = links[i];
    const pg = pool[i % pool.length];
    try {
        const res = await pg.goto(lnk, { timeout: 5000 });
        if (!res || res.status() >= 400) {
        broken.push(lnk);
        onProgress?.(`❌ ${lnk} (status ${(res && res.status()) || 'none'})`);
        } else {
        onProgress?.(`✅ ${lnk}`);
        }
    } catch {
        broken.push(lnk);
        onProgress?.(`❌ ${lnk} (error)`);
    }
    }
    await Promise.all(pool.map(p => p.close()));

    return {
    id: 'all-link-check',
    name: 'All Site Link Check',
    description: 'Check all unique links on homepage.',
    status: broken.length ? 'Failed' : 'Passed',
    lastRun: new Date().toISOString(),
    details: broken.length ? `Broken links: ${broken.length}` : '',
    };
} finally {
    await page.close().catch(() => {});
}
}  

// Run all tests (no streaming)
async function runAllTests(onProgress?: (message: string) => void): Promise<TestResult[]> {
    const browser = await launchBrowser();
  
    try {
      const results: TestResult[] = [];
  
      const tests = [
        checkNewestArticlesSorted,
        //testNavFlow,
        testPerformance,
        testNoDuplicates,
        testA11y,
        //testAllLinks,
      ];
  
      for (const testFn of tests) {
        const result = await testFn(browser);
        saveTestResult(result); // Cache it
        results.push(result);
      }
  
      return results;
    } finally {
      await browser.close();
    }
  }  


// Get all test results (runs all tests fresh)
router.get('/', async (_req: Request, res: Response) => {
    try {
      const now = Date.now();
      const cachedResults = getCachedTestResults();
  
      if (cachedResults.length > 0 && now - lastCacheTime < CACHE_TTL) {
        console.log('Serving cached test results');
        return res.json(cachedResults);
      }
  
      console.log('Cache expired or empty, running tests fresh');
      const results = await runAllTests();
      lastCacheTime = now;
      return res.json(results);
  
    } catch (error) {
      console.error('Failed to run or get tests:', error);
      res.status(500).json({ error: 'Failed to run tests' });
    }
  });  

// Get single test result by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
      const now = Date.now();
      let cachedResults = getCachedTestResults();
  
      if (cachedResults.length === 0 || now - lastCacheTime >= CACHE_TTL) {
        cachedResults = await runAllTests();
        lastCacheTime = now;
      }
  
      const test = cachedResults.find(t => t.id === req.params.id);
  
      if (!test) {
        return res.status(404).json({ error: 'Test not found' });
      }
  
      res.json(test);
    } catch (error) {
      console.error('Failed to get test result:', error);
      res.status(500).json({ error: 'Failed to get test result' });
    }
  });  

// Stream live updates for a test by ID
router.get('/stream/:id', async (req: Request, res: Response) => {
  const testId = req.params.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    (res as any).flush?.();
  };

  const browser = await launchBrowser();

  try {
    if (testId === 'top-link-check') {
      // Stream top links test progress
      const brokenLinks: BrokenLink[] = [];
      const concurrency = 3;

      const linkPage = await browser.newPage();

      await linkPage.goto('https://news.ycombinator.com');

      const links: string[] = await linkPage.$$eval(
        'a.storylink, a.titlelink',
        (anchors: HTMLElement[]) =>
          Array.from(new Set(anchors.map(a => (a as HTMLAnchorElement).href)))
      );

      await linkPage.close();

      const pagePool: Page[] = await Promise.all(
        new Array(concurrency).fill(null).map(() => browser.newPage())
      );

      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const page = pagePool[i % concurrency];
        try {
          const response: PlaywrightResponse | null = await page.goto(link, { timeout: 10000 });
          if (!response || response.status() >= 400) {
            brokenLinks.push({ url: link });
            send({ message: `Broken link detected: ${link}` });
          } else {
            send({ message: `Checked link: ${link}` });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          brokenLinks.push({ url: link, error: errorMessage });
          send({ message: `Error on link ${link}: ${errorMessage}` });
        }
      }

      await Promise.all(pagePool.map(p => p.close()));

      send({
        message: `Test complete. Broken links: ${brokenLinks.length}`,
        done: true,
      });
    } else if (testId === 'new-sort-check') {
      // Run newest articles test, send one message when done
      const result = await checkNewestArticlesSorted(browser);
      send({ message: 'Test complete', result, done: true });
    } else if (testId === 'all-link-check') {
      // Stream crawling all links test progress
      const brokenLinks: BrokenLink[] = [];
      const visited = new Set<string>();
      const toVisit: string[] = ['https://news.ycombinator.com'];
      const concurrency = 3;

      const pagePool: Page[] = await Promise.all(
        new Array(concurrency).fill(null).map(() => browser.newPage())
      );

      try {
        while (toVisit.length > 0) {
          const batch = toVisit.splice(0, concurrency);

          await Promise.all(
            batch.map(async (url, i) => {
              if (visited.has(url)) return;
              visited.add(url);

              const page = pagePool[i];

              try {
                const response = await page.goto(url, { timeout: 10000 });
                if (!response || response.status() >= 400) {
                  brokenLinks.push({ url });
                  send({ message: `Broken link detected: ${url}` });
                  return;
                }

                send({ message: `Checked link: ${url}` });

                const newLinks: string[] = await page.$$eval(
                  'a[href]',
                  (anchors: HTMLElement[]) =>
                    anchors
                      .map(a => (a as HTMLAnchorElement).href)
                      .filter(href => href.startsWith('https://news.ycombinator.com'))
                );

                newLinks.forEach(link => {
                  if (!visited.has(link) && !toVisit.includes(link)) {
                    toVisit.push(link);
                  }
                });
              } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                brokenLinks.push({ url, error: errorMessage });
                send({ message: `Error on link ${url}: ${errorMessage}` });
              }
            })
          );
        }

        send({
          message: `Test complete. Broken links: ${brokenLinks.length}`,
          done: true,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        send({ message: `Error running test: ${msg}`, done: true });
      } finally {
        await Promise.all(pagePool.map(p => p.close()));
      }
    } else {
      send({ message: 'Test not found', done: true });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    send({ message: `Error: ${msg}`, done: true });
  } finally {
    await browser.close();
    res.end();
  }
});

export default router;