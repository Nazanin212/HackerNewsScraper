"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const articlesController_1 = require("../controllers/articlesController");
const router = express_1.default.Router();
router.get('/', articlesController_1.getArticles); // /api/articles?search=term&sort=newest
router.get('/:id', articlesController_1.getArticleById); // /api/articles/1
exports.default = router;
