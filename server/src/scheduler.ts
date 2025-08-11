import cron from 'node-cron';
import { fetchAndSaveHNData } from './scraper';

export default function startJobs() {
  fetchAndSaveHNData();

  // Schedule job every 10 mins
  cron.schedule('*/10 * * * *', () => {
    console.log('Running scheduled HN data refresh');
    fetchAndSaveHNData();
  });
}