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

class Crawler {
  private headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  async crawlerStartTitle(): Promise<any> {
    console.log('크롤링 시작');
    const URL = 'https://mcfamily.or.kr/programs/korean/13389';

    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === 'production',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.goto(URL, { waitUntil: 'networkidle0' });

      page.on('console', (msg) => console.log('Browser Console:', msg.text()));

      const container = await page.waitForSelector('.container.pb-\\[80px\\]', {
        timeout: 1000,
      });

      if (container) {
        // ElementHandle에서 HTML 문자열 추출
        const containerHTML = await container.evaluate((el) => el.outerHTML);

        // Cheerio로 파싱
        const $ = cheerio.load(containerHTML);

        // 제목 추출
        const titleText = $('.flex .mh5').text();
        console.log('제목:', titleText);

        // 본문 정보 추출
        const bodyList = $('ul.body3 li');
        bodyList.each((index, element) => {
          const text = $(element).text();
          console.log(`본문 ${index + 1}:`, text);
        });

        // 특정 인덱스만
        const firstText = bodyList.eq(0).text();
        const secondText = bodyList.eq(1).text();
        console.log('첫 번째:', firstText);
        console.log('두 번째:', secondText);
      }
    } catch (error) {
      console.error('선발 투수 크롤링 오류:', error);
    } finally {
      await browser.close();
    }
  }
}

// 메인 실행 함수
async function main() {
  const crawler = new Crawler();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'mcfamily':
      await crawler.crawlerStartTitle();
    default:
      console.log(`
사용법:
  npm run crawler mcfamily <URL>     - 다문화 가정 크롤링 
 `);
  }
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}
