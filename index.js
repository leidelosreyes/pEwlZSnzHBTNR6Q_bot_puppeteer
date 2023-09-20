const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const ids = require('./data/id.js');
const targetLinks = require('./data/url.js');
const userAgents = require('./data/userAgent.js');

async function processLink(link) {
  const browser = await puppeteer.launch({
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    // userDataDir: "%LOCALAPPDATA%\\Google\\Chrome\\User Data",
    // args: ["--start-fullscreen"],
    headless: 'new',
  });

  try {

    let lastUrl = "";
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });

    await page.setUserAgent(getRandomUserAgent());
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
    await page.goto(link, { waitUntil: "domcontentloaded" });
    // console.log(`User Agent: ${userAgent}`);
    console.log(`Initial page loaded: ${link}`);
    let totalClicks = 0;

    while (true) {
      const redirectedUrl = page.url();

      if (redirectedUrl === lastUrl) {
        console.log(`Reached final destination: ${redirectedUrl}`);
        page.on("dialog", async (dialog) => {
          await dialog.dismiss(); // Dismiss the alert, you can use dialog.accept() to accept it
        });
        0
        await page.waitForTimeout(3000);

        for (let i = 0; i < 5; i++) {
          // Scroll down
          await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight); // Scroll down by one viewport height
          });

          // Wait for a moment to allow the page to scroll
          await page.waitForTimeout(1000); // Adjust the time as needed

          // Scroll up
          await page.evaluate(() => {
            window.scrollBy(0, -window.innerHeight); // Scroll up by one viewport height
          });
          await page.waitForTimeout(1000); 
          await page.click('body');
          
        }
        console.log("scrolled and  clicked successfuly");
        // Wait for a short while to allow content to load (if needed)
        await page.waitForTimeout(1000); // Adjust the time as needed
        // Check if the page contains <a> tags
        const pageContent = await page.content();
        const aTagsCount = (pageContent.match(/<a /g) || []).length; // Count <a> tags

        if (aTagsCount > 0) {
          console.log(`Page contains ${aTagsCount} <a> tag(s).`);

          const hrefSelector = "a[href]";

          await page.waitForSelector(hrefSelector);
          const hrefElements = await page.$$(hrefSelector);

          if (hrefElements.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * hrefElements.length
            );
            const randomHrefElement = hrefElements[randomIndex];

            try {
                await randomHrefElement.click({ waitUntil: "domcontentloaded" });
                console.log(
                  "Clicked a random <a> tag with href attribute successfully."
                );
                await page.waitForTimeout(2000);
                browser.on('targetcreated', async target => {
                const newPage = await target.page();
                // Check if the target is a page
                if (newPage) {
                  const url = newPage.url();
                  await newPage.goto(url)
                  await page.waitForTimeout(5000);
                  console.log('New tab URL:', url);
                  await newPage.close();
                }
              });
            }
            catch {

              console.log("Clicking <a> tag failed. Trying <body> tag in page 3.");
              await page.waitForTimeout(5000);
              await page.click('body', { waitUntil: "domcontentloaded" });
              console.log("successfully click")


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

// Random user agent on array
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
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 4 secons
    }
  }
}

// Run the processing for all links in a forever loop
processAllLinks(shuffledLinks);