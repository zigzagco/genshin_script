"use strict"

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const iPhone = puppeteer.devices['iPhone 6'];
const { Telegraf } = require('telegraf')
const mongoose = require("mongoose");
const Post = require("./models/Post");


const start= new Date().getTime();
var listOfObjects = [];
const dir = './cookies_bank/';
(async () => {
    console.log("script started")
    await botRun()
    async function botRun() {
        const browser = await puppeteer.launch({
            //executablePath: '/usr/bin/chromium-browser'
            headless: false,
            args: [],
            //slowMo: 300,
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 1219,height: 668})
            await page.goto('https://genshindrop.com')
            const cookiesString = await fs.readFile('./cookies_bank/cookie'+13+'.json');
            const cookiesd = JSON.parse(cookiesString);
            await page.setCookie(...cookiesd);
            await page.goto("https://genshindrop.com",{ waitUntil: 'networkidle2' });
        console.log("end")
        await page.waitForTimeout(300000)
        await browser.close();
    }
    const end = new Date().getTime();
    console.log('Time to execute:' + (end - start)/1000 +'sec');


})();
