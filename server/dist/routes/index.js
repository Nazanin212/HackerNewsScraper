"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articles_1 = __importDefault(require("./articles"));
const bookmarks_1 = __importDefault(require("./bookmarks"));
const tags_1 = __importDefault(require("./tags"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'Hacker News API is running 🚀' });
});
router.use('/articles', articles_1.default);
router.use('/bookmarks', bookmarks_1.default);
router.use('/tags', tags_1.default);
exports.default = router;
