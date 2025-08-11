"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookmarksController_1 = require("../controllers/bookmarksController");
const router = express_1.default.Router();
router.get('/', bookmarksController_1.getBookmarks);
router.post('/', bookmarksController_1.addBookmark);
exports.default = router;
