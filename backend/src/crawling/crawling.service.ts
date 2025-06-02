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

  // css 선택자로 크롤링
  async crawlerStartPither(): Promise<any> {
    console.log('crawlerStartPither');
    const URL = 'https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx';

    const browser = await puppeteer.launch({
      headless: false,
    });

    // 게임 아이디만 따로 추려
    const gameIds: string[] = [];

    try {
      const page = await browser.newPage();
      //페이지 로드 대기
      await page.goto(URL, { waitUntil: 'networkidle0' });

      // 네트워크 요청 모니터링
      // page.on('request', (request) => {
      //   console.log('Request:', request.method(), request.url());
      // });

      // page.on('response', (response) => {
      //   console.log('Response:', response.url(), response.status());
      // });

      // 브라우저 콘솔 로그를 Node.js 콘솔로 전달
      page.on('console', (msg) => console.log('Browser Console:', msg.text()));

      await page.waitForSelector('.today-game .game-cont', { timeout: 1000 });

      // html 태그로 내용 갖고오기
      const content = await page.content();
      const $ = cheerio.load(content);
      const games: KboGameData[] = [];

      // 추가
      const gameHandles = await page.$$('.today-game .game-cont');
      for (const gameEl of gameHandles) {
        const gameElContent = await page.evaluate((el) => el.outerHTML, gameEl);

        await gameEl.click();

        const startTime = Date.now();

        await page.waitForFunction(
          () => {
            const element = document.querySelector('#gameCenterContents');
            const hasContent = element && element.innerHTML.trim().length > 0;
            return hasContent;
          },
          {
            timeout: 5000,
            polling: 100, // 100ms마다 체크
          },
        );

        // 내용이 채워진 후 DOM 가져오기
        const newContent = await page.evaluate(() => {
          const newElement = document.querySelector('#gameCenterContents');
          return newElement ? newElement.innerHTML : null; // innerHTML 반환
        });

        // cheerio로 HTML 파싱
        const $ = cheerio.load(newContent || '');

        // 로딩된 다음 데이터 긁어오기
        const gameData = await page.evaluate((el) => {
          const game = el as HTMLElement;

          const getText = (selector: string) => {
            const el = game.querySelector(selector);
            return el?.textContent?.trim().slice(1) ?? '';
          };

          const getImgAttr = (selector: string, attr: string) => {
            const el = game.querySelector(selector) as HTMLImageElement;
            return el?.getAttribute(attr) ?? '';
          };

          const getImgAttr2 = (selector: string, attr: string) => {
            const el = $(selector);
            return el.attr(attr) ?? '';
          };
          // console.log('game HTML:', newContent); // 전체 HTML 소스 출력

          return {
            awayPitcher: getText('.team.away .today-pitcher p'),
            homePitcher: getText('.team.home .today-pitcher p'),
            broadimage: `https:${getImgAttr('.top li:nth-child(2) img', 'src')}`,
            stime:
              game.querySelector('.top li:nth-child(3)')?.textContent?.trim() ??
              '',
            homePitcherImg: `https:${getImgAttr2('.tbl-pitcher tbody tr:first-child td.pitcher .player-img img.team', 'src')}`,
            awayPitcherImg: `https:${getImgAttr2('.tbl-pitcher tbody tr:nth-child(2) td.pitcher .player-img img.team', 'src')}`,
            gameID: game.getAttribute('g_id') ?? undefined,
          };
        }, gameEl);
        // games.push(gameData);
        console.log(gameData);

        // 대기
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      return games;
      // 이제 클릭 돌면서 선수 이미지 받아와
    } catch (error) {
      console.error(error);
    } finally {
      await browser.close();
    }
  }
}

// https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList
// https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx
// https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList?leId=1&srId=0,1,3,4,5,6,7,8,9&date=20250527
