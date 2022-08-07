"use strict"

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const iPhone = puppeteer.devices['iPhone 6'];
const { Telegraf } = require('telegraf')
const mongoose = require("mongoose");
const Post = require("./models/Post");


const start= new Date().getTime();
var listOfObjects = [];
(async () => {
    console.log("script started")
    const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/chromium-browser'
        headless: false,
        args: [],
        //slowMo: 300,
    });
    for (let i=0;i<5;i++){
        await botSell(browser,i)
    }
    await browser.close();

    async function botSell(browser,i) {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 1419,height: 668})
        try {
            await page.goto('https://genshindrop.com')
            const cookiesString = await fs.readFile('./cookies_bank/cookie'+4+'.json');
            const cookiesd = JSON.parse(cookiesString);
            await page.setCookie(...cookiesd);
            await page.goto("https://genshindrop.com/profile",{ waitUntil: 'networkidle2' });
            await page.waitForSelector('#app > div.container-fluid > div > main > div:nth-child(3) > section > div:nth-child(2) > div.col-12.col-lg-8 > div.d-flex.justify-content-start.align-items-center.panel.flex-column.py-3 > div > div > div.inventory-item-wrapper > div.inventory-sell-all > a')
            await page.waitForTimeout(10000)
            await page.click('#app > div.container-fluid > div > main > div:nth-child(3) > section > div:nth-child(2) > div.col-12.col-lg-8 > div.d-flex.justify-content-start.align-items-center.panel.flex-column.py-3 > div > div > div.inventory-item-wrapper > div.inventory-sell-all > a')
            await page.goto('https://genshindrop.com')
            const element = await page.waitForSelector('#app > div.container-fluid > div > main > nav > div.profile-nav > div > div.profile-nav__balance > div.profile-nav__balance__rub > span');
            const value = await element.evaluate(el => el.textContent);
            console.log(value)
            await page.close()
        }catch (e){
            console.log("error")
            await page.close()
        }

    }
    const end = new Date().getTime();
    console.log('Time to execute:' + (end - start)/1000 +'sec');
})();
