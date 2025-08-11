"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndSaveHNData = fetchAndSaveHNData;
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("./db"));
async function fetchHNItem(id) {
    try {
        const { data } = await axios_1.default.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return data;
    }
    catch (e) {
        console.error(`Failed to fetch HN item ${id}:`, e);
        return null;
    }
}
async function fetchAndSaveHNData() {
    try {
        const { data: topStoryIds } = await axios_1.default.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!topStoryIds || topStoryIds.length === 0) {
            console.warn('No top stories found');
            return;
        }
        // Fetch first 10 stories details
        const hnItems = await Promise.all(topStoryIds.slice(0, 10).map((id) => fetchHNItem(id)));
        // Filter only stories
        const stories = hnItems.filter(item => item && item.type === 'story');
        // Prepare articles for DB insert
        const articles = stories.map(story => ({
            id: story.id,
            title: story.title || '[No Title]',
            url: story.url || '',
            author: story.by || 'unknown',
            points: story.score || 0,
            content: story.text || '', // <-- store text content here
            created_at: new Date((story.time || 0) * 1000).toISOString()
        }));
        // Prepare comments: fetch up to first 3 comments per story for preview
        const comments = [];
        for (const story of stories) {
            if (!story.kids || story.kids.length === 0)
                continue;
            const commentIds = story.kids.slice(0, 3); // first 3 comments
            const fetchedComments = await Promise.all(commentIds.map(id => fetchHNItem(id)));
            fetchedComments.forEach(c => {
                if (c && c.type === 'comment' && c.text) {
                    comments.push({
                        id: c.id,
                        article_id: story.id,
                        text: c.text,
                        author: c.by || 'unknown',
                        created_at: new Date((c.time || 0) * 1000).toISOString()
                    });
                }
            });
        }
        console.log("[SCRAPER] Updating database");
        // Save articles & comments into SQLite in a transaction
        const insertArticles = db_1.default.prepare(`
      INSERT OR REPLACE INTO articles (id, title, url, author, points, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const insertComments = db_1.default.prepare(`
      INSERT OR REPLACE INTO comments (id, article_id, text, author, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
        const insertMany = db_1.default.transaction(() => {
            for (const article of articles) {
                insertArticles.run(article.id, article.title, article.url, article.author, article.points, article.created_at);
            }
            for (const comment of comments) {
                insertComments.run(comment.id, comment.article_id, comment.text, comment.author, comment.created_at);
            }
        });
        insertMany();
        console.log('HN data refreshed with articles and comment previews');
    }
    catch (error) {
        console.error('Error fetching or saving HN data:', error);
    }
}
