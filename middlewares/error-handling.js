const errorHandling  = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.type = 'application/json';
    ctx.status = err.status || 500;
    ctx.body = { data: [], error: err.message };
    ctx.app.emit('error', err, ctx);
  }
}

module.exports = errorHandling;
