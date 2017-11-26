const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const routes = require('./routes');
const render = require('koa-views-render');
const views = require('koa-views');
const handlebars = require('handlebars');
const app = new Koa();
const router = new Router();
const config = require('../config');

const {
  noSleepRequest,
  minsToMiliSecs
} = require('./utils');

let sites = require('../sites.json');

app
  .use(views(__dirname, {
    map: {
      hbs: 'handlebars'
    }
  }))
  .use(function (ctx) {
    ctx.state = {
      title: 'nosleep-server',
      sites: sites.list
    }
    return ctx.render('../views/index.hbs')
  })
  .use(cors())
  .use(koaBody())
  .use(router.routes())

app.listen(config.port, () => {
  console.log(`listening on port: ${config.port}`)
})

noSleepRequest(sites);
setInterval(() => {
  noSleepRequest(sites)
}, minsToMiliSecs(config.interval));
routes(router, sites, render);