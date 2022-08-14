"use strict"

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//const telegram = require('node-telegram-bot-api')
puppeteer.use(StealthPlugin())
const fs = require('fs').promises;
const { Telegraf } = require('telegraf')
const Post = require('./models/Post');
const mongoose = require("mongoose");
const requests = require("request");


const start= new Date().getTime();
const token = "5585280260:AAH-TP7PBknDFn5hMSLJYem18lWKaxGXKqo";




(async () => {
    const bot = new Telegraf(token)
    bot.command('getiteminfo',(ctx) => {
        posttotg("ahaha")
        //getPostItems(ctx)
    })
    bot.command('accauntinfo',(ctx) =>{
        //getPost(ctx)
    })
    await bot.launch()

    const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] });
    try {
        //posttotg('автокрутка запущена 😊')
        await dd(browser)
        //for (let i=0;i<filescount;i++){
            //await botSell(browser,i)
        //}
        //await browser.close()
    }catch (e){
        //await browser.close()
        console.log(e)
    }

    async function dd(browser){
        posttotg('ok')
        const page = await browser.newPage();
        await page.goto('https://example.com');
        await page.screenshot({path: 'example.png'});

        await browser.close();
    }
    //----------------------------function---------------------------
    async function botSell(browser,i) {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.setViewport({width: 1200,height: 668})
        try {
            await page.goto('https://genshindrop.com')
            const cookiesString = await fs.readFile('./cookies_bank/cookie'+i+'.json');
            const cookiesd = JSON.parse(cookiesString);
            await page.setCookie(...cookiesd);
            try {
                try {
                    await page.goto("https://genshindrop.com/case/24-chasa-oskolki", {waitUntil: 'networkidle2'});
                    await page.waitForSelector('#app > div.container-fluid > div > main > div:nth-child(3) > section > div.row.box-page > div:nth-child(4) > button')
                    await page.click('#app > div.container-fluid > div > main > div:nth-child(3) > section > div.row.box-page > div:nth-child(4) > button')
                    await page.waitForSelector('#goRoll')
                    await page.waitForTimeout(10000)
                    await page.click('#goRoll')
                    await page.waitForTimeout(10000)
                    posttotg("ID: "+i+" успех ✅")
                } catch (e) {
                    posttotg("ID: "+i+" неудача ❌")
                    console.log(e)
                }
                await page.goto("https://genshindrop.com/profile",{ waitUntil: 'networkidle2' });
                const element = await page.waitForSelector('#app > div.container-fluid > div > main > nav > div.profile-nav > div > div.profile-nav__balance > div.profile-nav__balance__rub > span');
                const value = await element.evaluate(el => el.textContent);
                const arr = await page.evaluate(() => Array.from(document.getElementsByClassName('profile-item-left-name'), e => e.innerText));
                console.log(value)
                console.log(arr)
                //await postTodb(i.toString(),value.toString(),arr)
                posttotg("Баланс:"+value.toString()+"\n"+"предметы: "+arr)
            }catch (e){
                console.log("предметов нет")
                posttotg("предметов нет 😔")
                await page.close()
            }
            //await page.waitForTimeout(10000)
            await page.close()
        }catch (e){
            console.log(e)
            await page.close()
        }

    }
    function posttotg(msg){
        if (msg==null){
            msg=""
        }
        const URI = 'https://api.telegram.org/bot5585280260:AAH-TP7PBknDFn5hMSLJYem18lWKaxGXKqo/sendMessage?chat_id=-610223069&parse_mode=markdown&text='+msg
        const encodedURI = encodeURI(URI);
        requests.post(encodedURI)
        console.log("ok")
    }

    const end = new Date().getTime();
    console.log('Time to execute:' + (end - start)/1000 +'sec');
})();