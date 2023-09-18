const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const ids = require('./data/id.js');

const userAgents = require('./data/userAgent.js');

async function processLink(link) {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());
  await page.waitForTimeout(5000);
  console.log("User Agent: " + getRandomUserAgent());
  let lastUrl = '';
  try {
      await page.goto(link, { waitUntil: 'domcontentloaded' });
      await page.setCacheEnabled(false);
      console.log(`Initial page loaded: ${link}`);
      await page.waitForTimeout(5000);
      const currentUrl = page.url();
      const redirectedUrl = page.url();
      while (true) {
        if (redirectedUrl === currentUrl) {
          console.log(`Reached final destination: ${redirectedUrl}`);
          if (lastUrl === redirectedUrl) {
            console.log(`Redirect loop detected. Breaking loop for link: ${link}`);
            break;
          } else {
            lastUrl = redirectedUrl;
          }
        }
        else {
          console.log("detected loop hole");
          console.log("page will close .......");
          await new Promise(resolve => setTimeout(resolve, 1000));
          await page.close();
          break; // Exit the loop after processing one link
        }
      }
  } catch (error) {
    console.error(`Error: ${error}`);
    // Handle the error as needed
  } finally {
    await page.waitForTimeout(10000);
    console.log("End Process");
    await browser.close();
  }
}


// Random ids on array
function getRandomId() {
  const randomIndex = Math.floor(Math.random() * ids.length);
  return ids[randomIndex];
}

// Random ids on array
function getRandomUserAgent() {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
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