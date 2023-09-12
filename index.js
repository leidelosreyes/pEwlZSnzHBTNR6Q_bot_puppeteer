const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const ids = [
  '6319867',
  '6319825',
  '6319824',
  '6319823',
  '6319821',
  '6319820',
  '6319819',
  '6319818',
  '6319817',
  '6319816',
  '6319811',
  '6319810',
  '6319810',
  '6319808',
  '6319807',
  '6319806',
  '6319803',
  '6319802',
  '6319798',
  '6318197',
  '6320400',
  '6320399',
  '6320398',
  '6320397',
  '6320396',
  '6320392',
  '6320391',
  '6320390',
  '6320388',
  '6320387',
  '6320386',
  '6320385',
  '6320384',
  '6320383',
  '6320382',
  '6320382',
  '6320382',
  '6320378',
  '6320377',
  '6320375'
];



const targetLinks = [
  'https://gloorsie.com/4/',
  'https://almstda.tv/4/',
  'https://thaudray.com/4/',
  'https://grunoaph.net/4/',
  'https://afodreet.net/4/',
  'https://psuftoum.com/4/',
  'https://whairtoa.com/4/',
  'https://augailou.com/4/',
  'https://ookroush.com/4/',
  'https://nabauxou.net/4/',
  'https://ptugnins.net/4/',
  'https://eptougry.net/4/',
  'https://itespurrom.com/4/',
  'https://intorterraon.com/4/',
  'https://shulugoo.net/4/',
  'https://hoglinsu.com/4/',
  'https://vasteeds.net/4/',
  'https://potskolu.net/4/',
  'https://vaikijie.net/4/',
  'https://chalaips.com/4/',
  'https://waufooke.com/4/',
  'https://whoursie.com/4/',
  'https://phomoach.net/4/',
  'https://sotchoum.com/4/',
  'https://afodreet.net/4/',
  'https://lidsaich.net/4/',
  'https://greewepi.net/4/',
  'https://soocaips.com/4/',
  'https://zirdough.net/4/',
  'https://whulsaux.com/4/',
  'https://dubzenom.com/4/',
  'https://woafoame.net/4/',
  'https://vaitotoo.net/4/',
  'https://zeekaihu.net/4/',
  'https://nabauxou.net/4/',
  'https://zaltaumi.net/4/',
  'https://keewoach.net/4/',
  'https://thefacux.com/4/',
  'https://atservineor.com/4/',
  'https://ptaupsom.com/4/',
  'https://atservineor.com/4/',
  'https://psuftoum.com/4/',
  'https://vaitotoo.net/4/',
  'https://vasteeds.net/4/',
  'https://dubzenom.com/4/',
  'https://soocaips.com/4/',
  'https://nabauxou.net/4/',
  'https://lidsaich.net/4/',
  'https://intorterraon.com/4/',
  'https://meenetiy.com/4/'
];


async function processLink(link) {

  //browser for AWS
  // const browser = await puppeteer.launch({
  //   executablePath: "/usr/bin/chromium-browser",
  //   // userDataDir: "%LOCALAPPDATA%\\Google\\Chrome\\User Data",
  //   headless: 'new',
  //         args: ['--no-sandbox']
  // });

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: 'new',
  });

  try {
    let lastUrl = '';

    const page = await browser.newPage();

    while (true) {
      await page.goto(link, { waitUntil: 'domcontentloaded' });
      console.log(`Initial page loaded: ${link}`);
      await page.waitForTimeout(3000);

      const currentUrl = page.url();

      while (true) {
        const redirectedUrl = page.url();

        if (redirectedUrl === currentUrl) {
          console.log(`Reached final destination: ${redirectedUrl}`);
          const bodyHandle = await page.$('body');
          const { x, y } = await bodyHandle.boundingBox();

          // Calculate a point within the body and click it
          const clickX = x + Math.random() * (x + 1);
          const clickY = y + Math.random() * (y + 1);

          await page.mouse.click(clickX, clickY);
          console.log("page.mouse.click("+clickX+", "+clickY+")");
          await page.waitForTimeout(3000);
          console.log('done: ' + redirectedUrl);

          if (lastUrl === redirectedUrl) {
            console.log(`Redirect loop detected. Breaking loop for link: ${link}`);
            break;
          } else {
            lastUrl = redirectedUrl;
          }
        }

        // Wait for 1 second before checking the URL again
        await page.waitForTimeout(1000); // 1000 milliseconds = 1 second
      }

      await page.close();
      break; // Exit the loop after processing one link
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}

 // Random ids on array
function getRandomId() {
  const randomIndex = Math.floor(Math.random() * ids.length);
  return ids[randomIndex];
}

// Shuffle the base url
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledLinks = shuffleArray([...targetLinks]);

// process all the shuffle link and random ids

async function processAllLinks(links) {
  while (true) {
    for (const link of links) {
      const randomTargetLink = link + getRandomId();
      console.log("Random Links : "+" "+randomTargetLink);
      await processLink(randomTargetLink);
    }
  }
}

// Run the processing for all links in a forever loop
processAllLinks(shuffledLinks);