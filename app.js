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
const token = "5585280260:AAH-TP7PBknDFn5hMSLJYem18lWKaxGXKqo"
const chat_id=-610223069
var filescount;
const dir = './cookies_bank/';
fs.readdir(dir).then(r => {
    filescount=r.length - 1
});
(async () => {
    console.log("script started")
    const bot = new Telegraf(token)//сюда помещается токен, который дал botFather
    posttotg("бот перезапущен 😊")
    //bot.sendMessage(256681079,"jnjjnj")
    //========== Server script ===========
    /*const hour=21600000
    setInterval(async function intervalFunc() {
        bot.sendMessage('автокрутка начата 5h')
        const browser = await puppeteer.launch({
            //executablePath: '/usr/bin/chromium-browser'
            headless: true,
            args: [],
            //slowMo: 300,
        });
        try {
            for (let i=0;i<filescount;i++){
                posttotg('автокрутка запущена 😊')
                await botSell(browser,i)
            }
            await browser.close()
        }catch (e){
            await browser.close()
            console.log(e)
        }

    }, hour);*/
    //========== Server script ===========
    bot.start((ctx) => ctx.reply('Welcome')) //ответ бота на команду /start
    bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
    bot.command('getiteminfo',(ctx) => {
        getPostItems(ctx)
    })
    //bot.on('sticker', (ctx) => ctx.reply(''))
    bot.command('accauntinfo',(ctx) =>{
        getPost(ctx)
    })
    bot.catch(e=>{
        console.log(e)
    })
    bot.command('run',async (ctx) => {
        ctx.reply('запуск')
        const hour=21600000
        setInterval(async function intervalFunc() {
            ctx.reply('начинаем через 11 часов')
            const browser = await puppeteer.launch({
                //executablePath: '/usr/bin/chromium-browser'
                headless: true,
                args: [],
                //slowMo: 300,
            });
            try {
                for (let i=0;i<filescount;i++){
                    await botSell(ctx,browser,i)
                }
                await browser.close()
            }catch (e){
                await browser.close()
                console.log(e)
            }
            await ctx.reply('конец')
        }, hour);
    })
    bot.command('onerun',async (ctx) => {
        ctx.reply('Started')
        const browser = await puppeteer.launch({
            //executablePath: '/usr/bin/chromium-browser'
            headless: true,
            args: [],
            //slowMo: 300,
        });
        try {
            for (let i=0;i<filescount;i++){
                await botSell(ctx,browser,i)
            }
            await browser.close()
        }catch (e){
            await browser.close()
            console.log(e)
        }
        ctx.reply('Finished')
    })
    bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
    await bot.launch() // запуск бота

    //----------------------------function---------------------------
    async function botSell(ctx,browser,i) {
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
                //await page.waitForSelector('#app > div.container-fluid > div > main > div:nth-child(3) > section > div:nth-child(2) > div.col-12.col-lg-8 > div.d-flex.justify-content-start.align-items-center.panel.flex-column.py-3 > div > div > div.inventory-item-wrapper > div.inventory-sell-all > a')
                //await page.waitForTimeout(10000)
                //await page.click('#app > div.container-fluid > div > main > div:nth-child(3) > section > div:nth-child(2) > div.col-12.col-lg-8 > div.d-flex.justify-content-start.align-items-center.panel.flex-column.py-3 > div > div > div.inventory-item-wrapper > div.inventory-sell-all > a')
                //await page.goto('https://genshindrop.com')
                const element = await page.waitForSelector('#app > div.container-fluid > div > main > nav > div.profile-nav > div > div.profile-nav__balance > div.profile-nav__balance__rub > span');
                const value = await element.evaluate(el => el.textContent);
                const arr = await page.evaluate(() => Array.from(document.getElementsByClassName('profile-item-left-name'), e => e.innerText));
                console.log(value)
                console.log(arr)
                await postTodb(i.toString(),value.toString(),arr)
                posttotg("Баланс:"+value.toString()+"\n"+"предметы: "+arr)
            }catch (e){
                console.log("предметов нет")
                posttotg("предметов нет 😔")
                await page.close()
            }
            //await page.waitForTimeout(1000)
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
    function getPostItems(ctx){
        const DB_URL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
        //const DB_URL = 'mongodb://192.168.5.125:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
        if (mongoose.connection.readyState === 0) {
            mongoose.connect(DB_URL);
        }
        Post.find({}, null, {sort: 'критерий сортировки'},function (err, res) {
            fitem(res.map((num) => num.id),res.map((num) => num.items),ctx)
        });
    }
    function fitem(idss,items,ctx) {
        let stringg
        let kstr=""
        let obsh_money
        let money=0
        for (let l=0;l<idss.length;l++){
            stringg=kstr+"id: "+idss[l]+"\n"+"предметы: "+items[l]+"\n"
            kstr=stringg
        }
        ctx.reply(kstr)
    }
    //----------------------get post from db------------------------------
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
    //----------------------get post from db------------------------------

    //----------------------post to db------------------------------
    function postTodb(pageId,pageTitle,arr){
        if (pageId !=null && pageTitle !=null){
            upsertPost({
                id: pageId,
                title: pageTitle,
                items: arr
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
            }"use strict"

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
            const token = "5585280260:AAH-TP7PBknDFn5hMSLJYem18lWKaxGXKqo"
            const chat_id=-610223069
            var filescount;
            const dir = './cookies_bank/';
            fs.readdir(dir).then(r => {
                filescount=r.length - 1
            });
            (async () => {
                console.log("script started")
                const bot = new Telegraf(token)//сюда помещается токен, который дал botFather
                posttotg("бот перезапущен 😊")
                //bot.sendMessage(256681079,"jnjjnj")
                //========== Server script ===========
                /*const hour=21600000
                setInterval(async function intervalFunc() {
                    bot.sendMessage('автокрутка начата 5h')
                    const browser = await puppeteer.launch({
                        //executablePath: '/usr/bin/chromium-browser'
                        headless: true,
                        args: [],
                        //slowMo: 300,
                    });
                    try {
                        for (let i=0;i<filescount;i++){
                            posttotg('автокрутка запущена 😊')
                            await botSell(browser,i)
                        }
                        await browser.close()
                    }catch (e){
                        await browser.close()
                        console.log(e)
                    }

                }, hour);*/
                //========== Server script ===========
                bot.start((ctx) => ctx.reply('Welcome')) //ответ бота на команду /start
                bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
                bot.command('getiteminfo',(ctx) => {
                    getPostItems(ctx)
                })
                //bot.on('sticker', (ctx) => ctx.reply(''))
                bot.command('accauntinfo',(ctx) =>{
                    getPost(ctx)
                })
                bot.catch(e=>{
                    console.log(e)
                })
                bot.command('run',async (ctx) => {
                    ctx.reply('запуск')
                    const hour=21600000
                    setInterval(async function intervalFunc() {
                        ctx.reply('начинаем через 11 часов')
                        const browser = await puppeteer.launch({
                            //executablePath: '/usr/bin/chromium-browser'
                            headless: true,
                            args: [],
                            //slowMo: 300,
                        });
                        try {
                            for (let i=0;i<filescount;i++){
                                await botSell(ctx,browser,i)
                            }
                            await browser.close()
                        }catch (e){
                            await browser.close()
                            console.log(e)
                        }
                        await ctx.reply('конец')
                    }, hour);
                })
                bot.command('onerun',async (ctx) => {
                    ctx.reply('Started')
                    const browser = await puppeteer.launch({
                        //executablePath: '/usr/bin/chromium-browser'
                        headless: true,
                        args: [],
                        //slowMo: 300,
                    });
                    try {
                        for (let i=0;i<filescount;i++){
                            await botSell(ctx,browser,i)
                        }
                        await browser.close()
                    }catch (e){
                        await browser.close()
                        console.log(e)
                    }
                    ctx.reply('Finished')
                })
                bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
                await bot.launch() // запуск бота

                //----------------------------function---------------------------
                async function botSell(ctx,browser,i) {
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
                            //await page.waitForSelector('#app > div.container-fluid > div > main > div:nth-child(3) > section > div:nth-child(2) > div.col-12.col-lg-8 > div.d-flex.justify-content-start.align-items-center.panel.flex-column.py-3 > div > div > div.inventory-item-wrapper > div.inventory-sell-all > a')
                            //await page.waitForTimeout(10000)
                            //await page.click('#app > div.container-fluid > div > main > div:nth-child(3) > section > div:nth-child(2) > div.col-12.col-lg-8 > div.d-flex.justify-content-start.align-items-center.panel.flex-column.py-3 > div > div > div.inventory-item-wrapper > div.inventory-sell-all > a')
                            //await page.goto('https://genshindrop.com')
                            const element = await page.waitForSelector('#app > div.container-fluid > div > main > nav > div.profile-nav > div > div.profile-nav__balance > div.profile-nav__balance__rub > span');
                            const value = await element.evaluate(el => el.textContent);
                            const arr = await page.evaluate(() => Array.from(document.getElementsByClassName('profile-item-left-name'), e => e.innerText));
                            console.log(value)
                            console.log(arr)
                            await postTodb(i.toString(),value.toString(),arr)
                            posttotg("Баланс:"+value.toString()+"\n"+"предметы: "+arr)
                        }catch (e){
                            console.log("предметов нет")
                            posttotg("предметов нет 😔")
                            await page.close()
                        }
                        //await page.waitForTimeout(1000)
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
                function getPostItems(ctx){
                    const DB_URL = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
                    //const DB_URL = 'mongodb://192.168.5.125:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
                    if (mongoose.connection.readyState === 0) {
                        mongoose.connect(DB_URL);
                    }
                    Post.find({}, null, {sort: 'критерий сортировки'},function (err, res) {
                        fitem(res.map((num) => num.id),res.map((num) => num.items),ctx)
                    });
                }
                function fitem(idss,items,ctx) {
                    let stringg
                    let kstr=""
                    let obsh_money
                    let money=0
                    for (let l=0;l<idss.length;l++){
                        stringg=kstr+"id: "+idss[l]+"\n"+"предметы: "+items[l]+"\n"
                        kstr=stringg
                    }
                    ctx.reply(kstr)
                }
                //----------------------get post from db------------------------------
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
                //----------------------get post from db------------------------------

                //----------------------post to db------------------------------
                function postTodb(pageId,pageTitle,arr){
                    if (pageId !=null && pageTitle !=null){
                        upsertPost({
                            id: pageId,
                            title: pageTitle,
                            items: arr
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
                //----------------------post to db end------------------------------

                const end = new Date().getTime();
                console.log('Time to execute:' + (end - start)/1000 +'sec');
            })();


        });
    }
    //----------------------post to db end------------------------------

    const end = new Date().getTime();
    console.log('Time to execute:' + (end - start)/1000 +'sec');
})();

