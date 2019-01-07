const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = 'home';
})

// Can be used to match against all methods
router.all('/all', (ctx, next) => {
  ctx.body = 'all home'
})

// Named routes
router.get('user', '/users/:id', (ctx, next) => {
  // path
  console.log(ctx._matchedRoute);
  // path name
  console.log(ctx._matchedRouteName);

  ctx.body = `users ${ctx.params.id}`;
})

// Mutiple middleware
router.get(
  '/mutiple/:id',
  (ctx, next) => {
    console.log('mutiple middleware');
    next()
  },
  (ctx) => {
    ctx.body = 'mutiple middleware';
  }
)

// Nested routers
const fornums = new Router();
const posts = new Router();

posts.get('/', (ctx, next) => {
  ctx.body = `fornums fid: ${ctx.params.fid}. posts index`;
});
posts.get('/:id', (ctx, next) => {
  ctx.body = `fornums fid: ${ctx.params.fid}. posts id: ${ctx.params.id}`;
});
fornums.use(
  '/fornums/:fid/posts',
  posts.routes(),
  posts.allowedMethods()
);
app
  .use(fornums.routes())
  .use(fornums.allowedMethods())

// Router prefixes
const prefixRouter = new Router({
  prefix: '/prefix'
});
prefixRouter.get('/', (ctx, next) => {
  ctx.body = 'prefixes router';
}); 
app
  .use(prefixRouter.routes())
  .use(prefixRouter.allowedMethods())

app
  .use(router.routes())
  .use(router.allowedMethods())

// URL parameters
const urlRouter = new Router({
  prefix: '/url/parameter'
});
urlRouter.get('/:category/:title', (ctx, next) => {
  ctx.body = `url parameter, category: ${ctx.params.category}, title: ${ctx.params.title}`; 
})
app
  .use(urlRouter.routes())
  .use(urlRouter.allowedMethods())

// router param
const paramRouter = new Router({
  prefix: '/param/router'
});
paramRouter
  .param('param', (id, ctx, next) => {
    console.log(id);
    next();
  })
  .get('/:param', (ctx) => {
    ctx.body = 'param router'
  })

app
  .use(paramRouter.routes())
  .use(paramRouter.allowedMethods())

app.listen(3000)

