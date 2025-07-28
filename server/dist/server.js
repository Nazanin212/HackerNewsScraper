"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const topStories_1 = __importDefault(require("./routes/topStories"));
const hackerNewsTests_1 = __importDefault(require("./routes/hackerNewsTests"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = '0.0.0.0';
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes
app.use('/top-stories', topStories_1.default);
app.use('/tests', hackerNewsTests_1.default);
// Serve React frontend build (for production)
app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
// React Router fallback route
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/build/index.html'));
});
// Start server
console.log('[Server] Express server started on port:', PORT);
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});
