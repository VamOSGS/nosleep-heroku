const updateFile = require('./utils');
module.exports = (router, sites) => {
  
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

}