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

const sample = sony;

async function start() {
  let data = {};

  // Launch browser
  console.log("Launching browser");
  const browser = await puppeteer.launch();

  // Create new page
  const page = await browser.newPage();

  // Specify which url to go to
  await page.goto(sample.url);

  // Click button to close cookies modal
  console.log("Closing cookies modal");
  await page.click("#sp-cc-rejectall-link");

  // Extracting the title
  console.log("Extracting title");
  data.title = await page.$eval("#productTitle", (el) => {
    return el.textContent.trim();
  });

  // Extracting the price
  console.log("Extracting price");
  data.price = await page.$eval(".a-offscreen", (el) => {
    return el.textContent;
  });

  console.log("Creating new directory");
  await fs.mkdir(`./products/${sample.name}`, { recursive: true });

  // Extracting the main image
  console.log("Extracting main image");
  const mainImageSrc = await page.$eval(
    "#main-image-container > ul > li.image.item.itemNo0.maintain-height.selected > span > span > div > img",
    (el) => {
      return el.src;
    }
  );

  // Hitting the image page
  console.log("Going to the image page");
  const mainImagePage = await page.goto(mainImageSrc);

  // Save image locally
  console.log("Saving image locally");
  const filePath = `products/${sample.name}/${sample.name}.jpg`;
  await fs.writeFile(filePath, await mainImagePage.buffer());
  data.imagePath = filePath;

  // Stringifying the data
  console.log("Converting data and writing JSON");
  const jsonOutput = JSON.stringify(data);
  await fs.writeFile(`products/${sample.name}/${sample.name}.json`, jsonOutput);

  // Close the browser
  console.log("Closing browser");
  await browser.close();
}

start();
