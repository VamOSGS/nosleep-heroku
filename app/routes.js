const {
  updateFile
} = require('./utils');

module.exports = (router, sites, render) => {

  router.get('/', async(ctx, next) => {
    ctx.state = {
      title: 'nosleep-server',
      sites: sites.list
    }
    return ctx.render('../views/index.hbs')
  })
  router.get('/get', async(ctx, next) => {
    ctx.body = {
      sites: sites.list
    }
  })
  router.post('/sites/:name', async(ctx, next) => {
    const name = ctx.params.name;
    let newSites = sites;
    const validate = newSites.list.indexOf(name) == -1;
    if (validate) {
      newSites.list = [...newSites.list, name];
      updateFile(newSites);
      ctx.body = newSites;
    } else {
      ctx.body = {
        message:  'Site already exist in list',
        error: true
      };
    }
  })
  
  router.delete('/sites/:name', async(ctx, next) => {
    const name = ctx.params.name;
    let newSites = sites;
    newSites.list = newSites.list.filter(item => item !== name);
    updateFile(newSites);
    ctx.body = newSites;
  })

}