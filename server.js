const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;
const INTERVAL = 15; // mins

let sites;

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

app
    .use(cors())
    .use(koaBody())
    .use(router.routes())

router.get('/', async(ctx, next) => {
    ctx.body = sites;
})

router.post('/sites', async(ctx, next) => {
    const data = JSON.parse(ctx.request.body);
    let newSites = sites;
    const validate = newSites.list.indexOf(data.name) == -1;

    if (validate) {
        newSites.list = [...newSites.list, data.name];
        updateFile(newSites);
        ctx.body = newSites;
    } else {
        ctx.body = 'Site already exist in list';
    }
})
router.delete('/sites/:name', async(ctx, next) => {
    const name = ctx.params.name;
    let newSites = sites;
    newSites.list = newSites.list.filter(item => item !== name);
    updateFile(newSites);
    ctx.body = newSites;
})


readSitesAndSend();
setInterval(() => {
    readSitesAndSend()
}, minsToMiliSecs(INTERVAL));

function readSitesAndSend() {
    fs.readFile('./sites.json', 'utf-8', (err, data) => {
        if (err) throw err;
        sites = JSON.parse(data);
        sites.list.map(siteName => https.get(`https://${siteName}.herokuapp.com/`))
    })
}

function minsToMiliSecs(mins) {
    return mins * 6e4;
}

function updateFile(content) {
    fs.writeFile('./sites.json', JSON.stringify(content), (err) => {
        if (err) throw err;
    });
}