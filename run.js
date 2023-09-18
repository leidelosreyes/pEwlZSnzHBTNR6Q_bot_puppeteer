const puppeteer = require("puppeteer-extra");
// const puppeteer = require('puppeteer');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const targetLinks = require('./data/url.js');
puppeteer.use(StealthPlugin());

async function getRandomCoordinates(page) {
  const { width, height } = await page.evaluate(() => {
    const { body } = document;
    return { width: body.offsetWidth, height: body.offsetHeight };
  });

  const randomX = Math.floor(Math.random() * width);
  const randomY = Math.floor(Math.random() * height);

  return { x: randomX, y: randomY };
}

async function processLinks(links) {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: false , // Set to true for headless mode, false to view the browser
  });

  try {
    // let last_url = '';
    const newlinks = links[Math.floor(Math.random() * links.length)];
    console.log('newlinks: ' + newlinks);
    // for (const link of newlinks) {
    let lastUrl = "";
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    const client = await page.target().createCDPSession();

    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    // Log cache status
    // const cacheDisabled = true; // Assuming cache is disabled
    // console.log(`Cache is ${cacheDisabled ? 'disabled' : 'enabled'}`);
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0');

    await page.setRequestInterception(true);

    page.on('request', (request) => {
      const resourceType = request.resourceType();

      if (
        resourceType === 'image' ||
        resourceType === 'media' ||
        resourceType === 'font' ||
        resourceType === 'stylesheet' ||
        resourceType === 'fetch' ||
        resourceType === 'eventsource'
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    await page.goto(newlinks, { waitUntil: "domcontentloaded" });
    // console.log(`User Agent: ${userAgent}`);
    console.log(`Initial page loaded: ${newlinks}`);
    let totalClicks = 0;

    while (true) {
      const redirectedUrl = page.url();

      if (redirectedUrl === lastUrl) {
        console.log(`Reached final destination: ${redirectedUrl}`);
        // page.on("dialog", async (dialog) => {
        //   await dialog.dismiss(); // Dismiss the alert, you can use dialog.accept() to accept it
        // });

        await page.waitForTimeout(3000);

        // Check if the page contains <a> tags
        const pageContent = await page.content();
        const aTagsCount = (pageContent.match(/<a /g) || []).length; // Count <a> tags

        if (aTagsCount > 0) {
     
          console.log(`Page contains ${aTagsCount} <a> tag(s).`);
          await page.waitForTimeout(5000);
          const hrefSelector = "a[href]";

          await page.waitForSelector(hrefSelector);
          const hrefElements = await page.$$(hrefSelector);

          if (hrefElements.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * hrefElements.length
            );
            const randomHrefElement = hrefElements[randomIndex];
           await randomHrefElement.click({ waitUntil: "domcontentloaded" });
            console.log(
              "Clicked a random <a> tag with href attribute successfully."
            );

            console.log( "looped url : " + page.url());
            await page.waitForTimeout(3000);
            browser.on('targetcreated', async target => {
              if (target.type() === 'page') {
                const newPage = await target.page();
                const newPageUrl = newPage.url();
                const frame = page.frames().find(frame => frame.url());
                if (frame) {
                  console.log( "looped url 3:  " + page.url());
                  console.log("Transactions finished");
                }
                console.log('New tab URL:', newPageUrl);
                await page.goBack();
              }
            });
            if(page.url()!== lastUrl){  
              console.log( "looped url 2:  " + page.url());
              const frame = page.frames().find(frame => frame.url().includes(page.url()));
              if (frame) {
                await page.waitForTimeout(5000);
                await frame.click('a');
                await page.goBack();
                console.log("Transactions finished");
              }
            
            }
            await page.goBack();
            console.log("go back"); 
            await page.waitForTimeout(2000); // Adjust as needed
            
          } else {
            console.error("No <a> tags with href attributes found.");
            continue;
          }
        }

        // await page.waitForTimeout(1000);
        // await browser.close();

        break;
      }

      lastUrl = redirectedUrl;
      // console.log(`${lastUrl} = ${redirectedUrl};`);
    }
    await page.close();
    // }
    await browser.close();
  } catch (error) {
    console.error(`${error}`);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}

// Run the processing in a forever loop
async function foreverLoop() {
  while (true) {
    await processLinks(targetLinks);

    console.log(
      "Loop iteration completed. Waiting before starting the next iteration."
    );
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 minute
  }
}

foreverLoop();
