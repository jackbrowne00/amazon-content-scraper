const puppeteer = require("puppeteer");
const fs = require("fs/promises");

console.log("Running index.js");

const airpods = {
  name: "airpods",
  url: "https://www.amazon.co.uk/Apple-AirPods-Pro-2nd-generation/dp/B0BDJ37NF5/ref=sr_1_6?crid=SDFBDW3CLQU2&keywords=apple+airpods&qid=1668541657&sprefix=apple+airpods%2Caps%2C155&sr=8-6",
};

const sony = {
  name: "sony-headphones",
  url: "https://www.amazon.co.uk/dp/B09Y2MYL5C/ref=twister_B09ZPGDRVY?_encoding=UTF8&th=1",
};

const data = sony;

async function start() {
  // Launch browser
  console.log("Launching browser");
  const browser = await puppeteer.launch();

  // Create new page
  const page = await browser.newPage();

  // Specify which url to go to
  await page.goto(data.url);

  // Click button to close cookies modal
  console.log("Closing cookies modal");
  await page.click("#sp-cc-rejectall-link");

  // Take a screenshot of the page
  //   console.log("Taking screenshot of page");
  //   await page.screenshot({ path: "airpods-amazon-screenshot2.png" });

  // Save the title and price
  console.log("Extracting title and price");
  const title = await page.$eval("#productTitle", (el) => {
    return el.textContent.trim();
  });

  console.log("Writing title");
  await fs.mkdir(`./${data.name}`, { recursive: true });
  await fs.writeFile(`${data.name}/${data.name}.txt`, title);

  // Save the main image
  console.log("Extracting main image");
  const mainImageSrc = await page.$eval(
    "#main-image-container > ul > li.image.item.itemNo0.maintain-height.selected > span > span > div > img",
    (el) => {
      return el.src;
    }
  );

  console.log("Going to the image page");
  const mainImagePage = await page.goto(mainImageSrc);

  // Save image locally
  console.log("Saving image locally");
  await fs.writeFile(
    `${data.name}/${data.name}.png`,
    await mainImagePage.buffer()
  );

  // Close the browser
  console.log("Closing browser");
  await browser.close();
}

start();
