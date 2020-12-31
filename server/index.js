const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

// config
const PORT = process.env.PORT || 3000;

const setUp = async (settings) => {
  const { target } = settings;

  const browser = await puppeteer.launch({
      headless: true
  });

  const webPage = await browser.newPage();

  await webPage.setViewport({ width: 1440, height: 800 });

  await webPage.goto(target, {
      waitUntil: "networkidle0"
  });

  return { browser, webPage }
}


app.get("/pdf", async (req, res) => {
  try {

    const { browser, webPage } = await setUp(req.query)

    const pdf = await webPage.pdf({
        printBackground: true,
        format: "Letter",
        landscape: true,
        margin: {
          top: "20px",
          bottom: "40px",
          left: "20px",
          right: "20px"
        }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);

  } catch (err) {

    console.log('ERROR', err.message);
    res.status(400).json({err: err.message});

  }
})


app.get("/img", async (req, res) => {
  try {

    const { browser, webPage } = await setUp(req.query)

    const img = await webPage.screenshot({
      fullPage: true
    })

    await browser.close();

    res.contentType("image/png");
    res.send(img);

  } catch (err) {

    console.log('ERROR', err.message);
    res.status(400).json({err: err.message});

  }
})


app.listen(PORT, () => {
    console.log("Server OK");
});
