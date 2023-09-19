const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const ids = require('./data/id.js');
const targetLinks = require('./data/url.js');
const userAgents = require('./data/userAgent.js');

async function processLink(link) {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: 'new',
  });

  try {
    let lastUrl = "";
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    const client = await page.target().createCDPSession();

    // await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    // Log cache status
    // const cacheDisabled = true; // Assuming cache is disabled
    // console.log(`Cache is ${cacheDisabled ? 'disabled' : 'enabled'}`);
   
    // await page.setRequestInterception(true);

    // page.on('request', (request) => {
    //   const resourceType = request.resourceType();

    //   if (
    //     resourceType === 'image' ||
    //     resourceType === 'media' ||
    //     resourceType === 'font' ||
    //     resourceType === 'stylesheet' ||
    //     resourceType === 'fetch' ||
    //     resourceType === 'eventsource'
    //   ) {
    //     request.abort();
    //   } else {
    //     request.continue();
    //   }
    // });
    await page.goto(link, { waitUntil: "domcontentloaded" });
    await page.setUserAgent(getRandomUserAgent());
    await page.waitForTimeout(5000);
    console.log("User Agent: " + getRandomUserAgent());

    // console.log(`User Agent: ${userAgent}`);
    console.log(`Initial page loaded: ${link}`);
    await page.waitForTimeout(3000);
    let totalClicks = 0;

    while (true) {
      const redirectedUrl = page.url();

      if (redirectedUrl === lastUrl) {
        console.log(`Reached final destination: ${redirectedUrl}`);
        page.on("dialog", async (dialog) => {
          await dialog.dismiss(); // Dismiss the alert, you can use dialog.accept() to accept it
        });

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
            let randomIndex = Math.floor(
              Math.random() * hrefElements.length
            );
            const randomHrefElement = hrefElements[randomIndex];
            await page.waitForTimeout(5000);
            let clickA = await randomHrefElement.click({ waitUntil: "domcontentloaded" });
            if (clickA = false) {
              await page.waitForTimeout(5000);
              await page.waitForSelector('body');
              await page.evaluate('body', (body) => {
                body.click({ waitUntil: "domcontentloaded" });
              });
              console.log(
                "Clicked a random <body> tag with href attribute successfully."
              );
            }
            else {
              console.log(
                "Clicked a random <a> tag with href attribute successfully."
              );
              await page.waitForTimeout(5000);
            }

            browser.on('targetcreated', async (target) => {
              if (target.type() === 'page') {
                const newPage = await target.page();
                const newPageUrl = newPage.url();
                
                // You don't need to wait for a timeout and body selector here.
                // Instead, you can directly click on the body element.
                await newPage.click('body');
            
                console.log(
                  "Clicked the <body> element successfully in the new page."
                );
                
                console.log('New tab URL:', newPageUrl);
                
                // You may want to close the new page instead of going back to the original page.
              //  await newPage.close();
              }
            });
            
            //console.log("looped url : " + page.url());
            await page.waitForTimeout(3000);
            if (page.url()) {
              console.log("looped url 2:  " + page.url());
              page.on("dialog", async (dialog) => {
                await dialog.dismiss(); // Dismiss the alert, you can use dialog.accept() to accept it
              });
              const hrefSelector = "a[href]";

              await page.waitForSelector(hrefSelector);
              const hrefElements = await page.$$(hrefSelector);
              
              const pageContent = await page.content();
              const aTagsCount = (pageContent.match(/<a /g) || []).length; // Count <a> tags

              console.log(`Page contains ${aTagsCount} <a> tag(s).`);
             // await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // You can use other options like 'load' or 'networkidle2'
              let randomIndex = Math.floor(
                Math.random() * hrefElements.length
              );
              const randomHrefElement = hrefElements[randomIndex];
              await page.waitForTimeout(5000);
              const clickA = await randomHrefElement.click();
              if (!clickA) {
                await page.waitForTimeout(5000);
                await page.waitForSelector('a');
                await page.$eval('a', (body) => {
                  body.click({ waitUntil: "domcontentloaded" });
                });
                console.log(
                  "Clicked a random <body> 2 tag with href attribute successfully."
                );
                await page.waitForTimeout(5000);
                await browser.close();
              }
              else {
                console.log(
                  "Clicked a random <a> tag with href attribute successfully."
                );
                await page.waitForTimeout(5000);
              }
              await browser.close();
            }
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