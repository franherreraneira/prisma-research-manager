import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{headless:true},webServer:process.env.APP_URL?undefined:{command:'npm run dev -- --host 127.0.0.1',url:'http://127.0.0.1:5173',reuseExistingServer:true}});
