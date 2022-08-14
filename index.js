"use strict"

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const fss = require('fs')
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
        //await page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 1219,height: 668})
        await page.goto("https://oauth.vk.com/authorize?client_id=8073149&redirect_uri=https%3A%2F%2Fgenshindrop.com%2Flogin%2Fvk%2Fcallback&scope=local&response_type=code",{ waitUntil: 'networkidle2' });
        await page.waitForSelector('input[name="email"]');
        await page.type('input[name="email"]','37121682008');
        await page.waitForSelector('input[type="password"]', { visible: true });
        await page.type('input[type="password"]', '2w9ARYU8HA');
        await page.waitForSelector("#install_allow", { visible: true });
        await page.click("#install_allow");
        await page.waitForTimeout(10000)
        //await page.goto('https://genshindrop.com/',{ waitUntil: 'networkidle2' })
        const cookies = await page.cookies()
        const cookieJson = JSON.stringify(cookies)
        const cookiesStringg = fss.writeFileSync('./cookies_bank/cookie'+14+'.json', cookieJson);
        await page.goto('https://genshindrop.com')
        const cookiesString = await fs.readFile('./cookies_bank/cookie'+14+'.json',(err) => {
            if (err) {
                console.log(err);
            }
        });
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
