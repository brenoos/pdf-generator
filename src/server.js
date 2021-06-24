const express = require("express");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const htmlPdf = require("html-pdf");
const app = express();

const passengers = [
  {
    name: "Joyce",
    flightNumber: 7859,
    time: "18h00",
  },
  {
    name: "Brock",
    flightNumber: 7859,
    time: "18h00",
  },
  {
    name: "Eve",
    flightNumber: 7859,
    time: "18h00",
  },
];

app.get("/pdf-puppeteer", async (request, response) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/public/index.html", {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: "Letter",
    path: "next-puppeter.pdf",
  });

  await browser.close();

  response.contentType("application/pdf");

  return response.send(pdf);
});

app.get("/pdf-no-puppeteer", async (request, response) => {
  const tmpl = fs.readFileSync(require.resolve("./public/index.html"), "utf8");

  htmlPdf
    .create(tmpl, { format: "Letter" })
    .toFile("./next-no-puppeteer.pdf", function (err, res) {
      if (err) return console.log(err);
      console.log(res);
      return response.send("terminou");
    });
});

app.use("/public", express.static(__dirname + "/public"));

app.listen(3000);
