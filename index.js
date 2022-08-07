"use strict"
//const mongoose = require('mongoose');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const fs = require('fs').promises;
const { Telegraf } = require('telegraf')
const Post = require('./models/Post');
const mongoose = require("mongoose");
const start= new Date().getTime();
(async () => {
    console.log("script started")
    let strtablee="";
    const loginmass = ["37121686794","37121145531","37121998577","37121156128","37121419381","37121048844","37121657045","37121388915",
        "37121590246","37121579764","37121706812","37121736437","37121877449","37121415893","37122287604","37121615388","37121367842","37121594298","37121645919","37121283450","37121247815"]
    const pass = "2w9ARYU8HA"
    const bot = new Telegraf("5585280260:AAH-TP7PBknDFn5hMSLJYem18lWKaxGXKqo") //сюда помещается токен, который дал botFather
    bot.start((ctx) => ctx.reply('Welcome')) //ответ бота на команду /start
    bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
    bot.on('sticker', (ctx) => ctx.reply(''))
    bot.command('accauntinfo',(ctx) =>{
        getPost(ctx)
    })
    bot.catch(e=>{
        console.log(e)
    })
    bot.command('run',async (ctx) => {
        ctx.reply('крутка запущена')
        const hour=43200000
        setInterval(async function intervalFunc() {
            ctx.reply('начинаем')
                try {
                    await botRun()
                }catch (e){
                    console.log(e)
                }
        }, hour);
        ctx.reply('конец')
    })
    bot.command('onerun',async (ctx) => {
        ctx.reply('Started')
            try {
                await botRun(ctx)
            }catch (e){
                console.log(e)
            }
        ctx.reply('Finished')
    })
    bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
    await bot.launch() // запуск бота

    async function botRun(ctx) {
        for (let n=0;n<loginmass.length;n++) {
            try {
                ctx.reply("cookie " + n)
                const browser = await puppeteer.launch({
                    //executablePath: '/usr/bin/chromium-browser'
                    headless: false,
                    args: [
                    ],
                    //slowMo: 300,
                });
                const page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.setViewport({width: 1000, height: 668})
                const cookiesString = await fs.readFile('./cookies_bank/cookie' + n + '.json');
                const cookies = JSON.parse(cookiesString);
                await page.setCookie(...cookies);
                await page.goto("https://genshindrop.com/case/24-chasa-oskolki", {waitUntil: 'networkidle2'});
                const element = await page.waitForSelector('#app > div.container-fluid > div > main > nav > div.profile-nav > div > div.profile-nav__balance > div.profile-nav__balance__rub > span');
                const value = await element.evaluate(el => el.textContent);
                await ctx.reply(value)
                await postTodb(n.toString(),value.toString())
                try {
                    await page.waitForSelector('#app > div.container-fluid > div > main > div:nth-child(3) > section > div.row.box-page > div:nth-child(4) > button')
                    await page.click('#app > div.container-fluid > div > main > div:nth-child(3) > section > div.row.box-page > div:nth-child(4) > button')
                    await page.waitForSelector('#goRoll')
                    await page.waitForTimeout(10000)
                    await page.click('#goRoll')
                    await page.waitForTimeout(10000)
                    ctx.reply("успешная крутка")
                } catch (e) {
                    ctx.reply("ошибка крутки")
                    console.log(e)
                }
                await page.close()
                await browser.close();
            }catch (e){
                ctx.reply("ошибка")
                console.log(e)
            }
        }
    }
        const end = new Date().getTime();
    function getPost(ctx){
        const DB_URL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
        //const DB_URL = 'mongodb://192.168.5.125:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(DB_URL);
        }
        Post.find({}, null, {sort: 'критерий сортировки'},function (err, res) {
            f(res.map((num) => num.id),res.map((num) => num.title),ctx)
        });
    }
    function f(idss,amound,ctx) {
        let stringg
        let kstr=""
        let obsh_money
        let money=0
        for (let l=0;l<idss.length;l++){
            stringg=kstr+"id: "+idss[l]+"  деньги: "+amound[l]+"\n"
            kstr=stringg
            obsh_money=money+parseInt(amound[l])
            money=obsh_money
        }
        ctx.reply(kstr+"всего: "+money.toString())
    }

    function postTodb(pageId,pageTitle){
        if (pageId !=null && pageTitle !=null){
            upsertPost({
                id: pageId,
                title: pageTitle
            });
            console.log("post to db")
        }else {
            console.log("dont post to db")
        }
    }
    function upsertPost(postObj) {
        const DB_URL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
        //const DB_URL = 'mongodb://192.168.5.125:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(DB_URL);
        }
        const conditions = {
            id: postObj.id
        };
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };

        Post.findOneAndUpdate(conditions, postObj, options, (err, result) => {
            if (err) {
                throw err;
            }
        });
    }

    async function setCookie(ctx) {
        for (let i=17;i<loginmass.length;i++){
            try {
                const browser = await puppeteer.launch({
                    //executablePath: '/usr/bin/chromium-browser'
                    headless: false,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process',
                        '--disable-gpu'
                    ],
                    //slowMo: 300,
                });
                const page = await browser.newPage();
                //await page.emulate(iPhone);
                //await page.setViewport({width: 1419,height: 668})
                await page.setDefaultNavigationTimeout(0);
                await page.goto('https://genshindrop.com/')
                await page.click('#app > div > div > main > nav > div.d-inline-flex.flex-row.justify-content-between.align-items-center > div.sign-in-button > a')
                //await page.waitForTimeout(20000)
                //await page.click('#signInForm > div > div > div.modal-body.px-4.pt-3 > div:nth-child(2) > a')
                await page.goto('https://genshindrop.com/login/vk')
                await page.focus('input[name=email]');
                await page.keyboard.type(loginmass[i]);
                await page.focus('input[name=pass]');
                await page.keyboard.type(pass);
                await page.click('#install_allow')
                await page.waitForTimeout(10000)
                await page.goto('https://genshindrop.com/')
                await page.waitForTimeout(5000)
                const cookies = await page.cookies();
                await fs.writeFile('./cookies_bank/cookie'+i+'.json', JSON.stringify(cookies, null, 2));
                const cookiesString = await fs.readFile('./cookies_bank/cookie'+i+'.json');
                const cookiesd = JSON.parse(cookiesString);
                await page.setCookie(...cookiesd);
                await page.close()
                await browser.close();
                await ctx.reply("cookie "+i+" получен")
            }catch (e){
                ctx.reply("ошибка получения cookie")
                console.log(e)
            }
        }
    }

    console.log('Time to execute:' + (end - start)/1000 +'sec');
})();
