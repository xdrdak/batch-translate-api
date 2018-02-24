const Koa = require('koa');
const _ = require('koa-route');
const datastore = require('nedb-promise');
const { translateAll } = require('./translate-api');
const querystring = require('querystring');

const PORT = process.env.NODE_ENV === 'production' ? 443 : 3000;
const app = new Koa();
const db = datastore({ autoload: true });

// Routes
app.use(_.get('/', ctx => {
  ctx.body = '(◕ᴗ◕✿)';
}));

app.use(_.get('/translate', async ctx => {
  const { q } = ctx.query;

  if (q) {
    const sanitizedQuery = querystring.escape(q);
    const cachedResult = await db.findOne({ query: sanitizedQuery });
    const results = cachedResult ? cachedResult.results : await translateAll(sanitizedQuery);

    // Sort from biggest to smallest.
    const nextResults = results.sort((r1, r2) => {
      return r1.length < r2.length;
    });

    // Cache results in the worst manner possible since I can't use redis on my instance of `now.sh`
    await db.insert({ query: sanitizedQuery, results: nextResults });
    ctx.body = { nextResults };
  } else {
    ctx.body = { error: 'Query param `q` cannot be empty.' }
  }
}));

console.log(`Server started at port ${PORT}.`);
app.listen(3000);
