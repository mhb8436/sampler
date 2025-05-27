import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

interface KboGameData {
  snm: string;
  simage: string | undefined;
  gtm: string;
  broadcating: string;
  status: string;
}

@Injectable()
export class CrawlingService {
  headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };
  async crawlerNaverNews(url: string) {
    try {
      const resp = await axios.get(url, { headers: this.headers });

      const $ = cheerio.load(resp.data);
      // 네이버 뉴스 특화 데이터 추출
      const title = $('.tit_view').text().trim();
      const content = $('.article_view').text().trim();
      const press = $('.press_logo img').attr('alt') || '';
      const date = $('.article_info .date').text().trim();
      const reporter = $('.article_info .reporter').text().trim();

      // 관련 뉴스 링크 추출
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
    } catch (e) {}
  }

  // https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx
  async crawlerKboGameList(date: string): Promise<KboGameData[]> {
    const browser = await puppeteer.launch({
      headless: true,
    });
    try {
      const page = await browser.newPage();

      // 페이지 로드 대기 설정
      await page.goto(
        'https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx',
        {
          waitUntil: 'networkidle0', // 모든 네트워크 연결이 완료될 때까지 대기
        },
      );

      // 게임 목록이 로드될 때까지 대기
      await page.waitForSelector('.today-game .game-cont', { timeout: 10000 });

      // 페이지의 HTML 내용 가져오기
      const content = await page.content();
      const $ = cheerio.load(content);
      const games: KboGameData[] = [];

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
    } catch (e) {
      console.error('Error crawling KBO game list:', e);
      return [];
    } finally {
      await browser.close();
    }
  }

  async crawlerKboGameJson(date: string) {
    const url = `https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList?leId=1&srId=0,1,3,4,5,6,7,8,9&date=${date}`;
    const resp = await axios.get(url, { headers: this.headers });
    return resp.data;
  }
}

// https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList
// https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx
// https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList?leId=1&srId=0,1,3,4,5,6,7,8,9&date=20250527
