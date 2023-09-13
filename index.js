const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const ids = require('./data/id.js');
const targetLinks = require('./data/url.js');
const userAgents = require('./data/userAgent.js');


async function processLink(link) {

  //browser for AWS
  // const browser = await puppeteer.launch({
  //   executablePath: "/usr/bin/chromium-browser",
  //   // userDataDir: "%LOCALAPPDATA%\\Google\\Chrome\\User Data",
  //   headless: 'new',
  //         args: ['--no-sandbox']
  // });

  for (const userAgent of userAgents) {
    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: 'new',
    });
  
    try {
      let lastUrl = '';
  
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      console.log(`User Agent: ${userAgent}`);
      while (true) {
        await page.goto(link, { waitUntil: 'domcontentloaded' });
        console.log(`Initial page loaded: ${link}`);
        await page.waitForTimeout(5000);
  
        const currentUrl = page.url();
        await page.waitForTimeout(3000);
        while (true) {
          const redirectedUrl = page.url();
          if (redirectedUrl === currentUrl) {
            console.log(`Reached final destination: ${redirectedUrl}`);
  
            const bodyHandle = await page.$('body');
            await page.waitForTimeout(3000);
              const { x, y } = await bodyHandle.boundingBox();
              // Calculate a point within the body and click it
              const clickX = x + Math.random() * (x + 1);
              const clickY = y + Math.random() * (y + 1);
              const clickX1 = x + Math.random() * (x + 1);
              const clickY1 = y + Math.random() * (y + 1);
              await page.mouse.click(clickX, clickY);
              await new Promise(resolve => setTimeout(resolve, 4000));
              console.log("page.mouse.click(" + clickX + ", " + clickY + ")");
              await new Promise(resolve => setTimeout(resolve, 4000));
              await page.mouse.click(clickX1, clickY1);
              console.log("page.mouse.click(" + clickX1 + ", " + clickY1 + ")");
              await new Promise(resolve => setTimeout(resolve, 4000));
              console.log('done: ' + redirectedUrl);
              //await new Promise(resolve => setTimeout(resolve, 4000));
              if (lastUrl === redirectedUrl) {
                console.log(`Redirect loop detected. Breaking loop for link: ${link}`);
                break;
              } else {
                lastUrl = redirectedUrl;
              }
          }
          else{
            console.log("detected loop hole");
            console.log("page will close .......");
            await new Promise(resolve => setTimeout(resolve, 1000));
            await page.close();
            break; // Exit the loop after processing one link
          }  
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
      console.log("Random Links : " + " " + randomTargetLink);
      await processLink(randomTargetLink);
      await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for 4 secons
    }
  }
}

// Run the processing for all links in a forever loop
processAllLinks(shuffledLinks);