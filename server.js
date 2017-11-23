const https = require('https');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;
const INTERVAL = 15; // mins

let sites;

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

router.get('/', async(ctx, next) => {
    console.log(sites);
    ctx.body = sites;
})

router.post('/sites', async(ctx, next) => {
    const data = ctx.request.body;
    let newSites = sites;
    const validate = newSites.list.indexOf(data.name) == -1;
    newSites.list = [...newSites.list, data.name];
    
    if (validate) {
        fs.writeFile('./sites.json', JSON.stringify(newSites), (err) => {
            if (err) throw err;
        });
        ctx.body = 'sites.json has been changed';
    } else {
        ctx.body = 'Site already exist in list';
    }

})

app
    .use(koaBody())
    .use(router.routes())


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