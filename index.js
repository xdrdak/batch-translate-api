const Koa = require('koa');
const _ = require('koa-route');
const { translateAll } = require('./translate-api');
const app = new Koa();
const PORT = 3000;

// Config

// Routes
app.use(_.get('/', ctx => {
  ctx.body = '(◕ᴗ◕✿)';
}));

app.use(_.get('/translate', async ctx => {
  const { q } = ctx.query;
  if (q) {
    const results = await translateAll(q);

    // Sort from biggest to smallest.
    const nextResults = results.sort((r1, r2) => {
      return r1.length < r2.length;
    });

    ctx.body = { nextResults };
  } else {
    ctx.body = { error: 'Query param `q` cannot be empty.' }
  }
}));

console.log(`Server started at port ${PORT}.`);
app.listen(3000);
