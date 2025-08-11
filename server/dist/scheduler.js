"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = startJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const scraper_1 = require("./scraper");
function startJobs() {
    (0, scraper_1.fetchAndSaveHNData)();
    // Schedule job every 10 mins
    node_cron_1.default.schedule('*/10 * * * *', () => {
        console.log('Running scheduled HN data refresh');
        (0, scraper_1.fetchAndSaveHNData)();
    });
}
