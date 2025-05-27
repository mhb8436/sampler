"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const puppeteer = __importStar(require("puppeteer"));
let CrawlingService = class CrawlingService {
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    };
    async crawlerNaverNews(url) {
        try {
            const resp = await axios_1.default.get(url, { headers: this.headers });
            const $ = cheerio.load(resp.data);
            const title = $('.tit_view').text().trim();
            const content = $('.article_view').text().trim();
            const press = $('.press_logo img').attr('alt') || '';
            const date = $('.article_info .date').text().trim();
            const reporter = $('.article_info .reporter').text().trim();
            const relatedNews = $('.related_news a')
                .map((_, el) => ({
                title: $(el).text().trim(),
                url: $(el).attr('href'),
            }))
                .get();
            return {
                url,
                title,
                content: content.substring(0, 1000) + '...',
                press,
                date,
                reporter,
                relatedNews,
                crawledAt: new Date(),
            };
        }
        catch (e) { }
    }
    async crawlerKboGameList(date) {
        const browser = await puppeteer.launch({
            headless: true,
        });
        try {
            const page = await browser.newPage();
            await page.goto('https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx', {
                waitUntil: 'networkidle0',
            });
            await page.waitForSelector('.today-game .game-cont', { timeout: 10000 });
            const content = await page.content();
            const $ = cheerio.load(content);
            const games = [];
            $('.today-game .game-cont').each((_, el) => {
                const game = $(el);
                const gameData = {
                    snm: game.find('.top li:nth-child(1)').text().trim(),
                    simage: game.find('.top li:nth-child(2) img').attr('src'),
                    gtm: game.find('.top li:nth-child(3)').text().trim(),
                    broadcating: game.find('.middle .broadcasting').text().trim(),
                    status: game.find('.middle .status').text().trim(),
                };
                games.push(gameData);
            });
            return games;
        }
        catch (e) {
            console.error('Error crawling KBO game list:', e);
            return [];
        }
        finally {
            await browser.close();
        }
    }
    async crawlerKboGameJson(date) {
        const url = `https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList?leId=1&srId=0,1,3,4,5,6,7,8,9&date=${date}`;
        const resp = await axios_1.default.get(url, { headers: this.headers });
        return resp.data;
    }
};
exports.CrawlingService = CrawlingService;
exports.CrawlingService = CrawlingService = __decorate([
    (0, common_1.Injectable)()
], CrawlingService);
//# sourceMappingURL=crawling.service.js.map