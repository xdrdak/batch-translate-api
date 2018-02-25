const Koa = require('koa');
const _ = require('koa-route');
const cors = require('@koa/cors');
const datastore = require('nedb-promise');
const querystring = require('querystring');
const { translateAll } = require('./translate-api');
const errorHandlingMiddleware = require('./middlewares/error-handling');

const PORT = process.env.NODE_ENV === 'production' ? 443 : 3000;
const app = new Koa();
const db = datastore({ autoload: true });

// Middlewares
app.use(cors());
app.use(errorHandlingMiddleware);

// Routes
app.use(_.get('/', ctx => {
  ctx.body = '(◕ᴗ◕✿)';
}));

app.use(_.get('/translate', async ctx => {
  ctx.type = 'application/json';
  const { q } = ctx.query;
  let bodyData = { data: [], error: null };

  if (q) {
    const nextQuery = q.toLowerCase();
    const cachedResult = await db.findOne({ query: nextQuery });
    const results = cachedResult ? cachedResult.results : await translateAll(nextQuery);

    // Sort from biggest to smallest.
    const nextResults = results.sort((r1, r2) => {
      return r1.length < r2.length;
    });

    // Cache results in the worst manner possible since I can't use redis on my instance of `now.sh`
    await db.insert({ query: nextQuery, results: nextResults });
    bodyData.data = nextResults;
  } else {
    bodyData.error = 'Query param `q` cannot be empty.';
  }

  ctx.body = bodyData;
}));

console.log(`Server started at port ${PORT}.`);
app.listen(PORT);
