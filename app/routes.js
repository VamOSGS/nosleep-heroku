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

  router.post('/sites/:name', async(ctx, next) => {
    const name = ctx.params.name;
    console.log('------------------------------------');
    console.log(name);
    console.log('------------------------------------');
    let newSites = sites;
    const validate = newSites.list.indexOf(name) == -1;

    if (validate) {
      newSites.list = [...newSites.list, name];
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