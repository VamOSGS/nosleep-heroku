const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;
const INTERVAL = 15; // mins

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

router.get('/', async (ctx, next) => {
    ctx.body = 'Running servers';
})

app
    .use(router.routes())

readSitesAndSend();
setInterval(() => {
    readSitesAndSend()
}, minsToMiliSecs(INTERVAL));

function readSitesAndSend() {
    fs.readFile('./sites.json', 'utf-8', (err, data) => {
        if (err) throw err;
        const sites = JSON.parse(data);
        sites.list.map((siteName, key) => {
            https.get(`https://${siteName}.herokuapp.com/`);
            console.log(siteName, key)
        })
        // fs.writeFile('./sites.json', 'react', 'utf-8', err => {
        //     if (err) return console.log(err);
        // })
    })
}

function minsToMiliSecs(mins) {
    return mins * 6e4;
}