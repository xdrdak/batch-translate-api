const translate = require('google-translate-api');
const languages = require('./languages');

const sleepFor = ms => new Promise(res => setTimeout(res, ms));

async function getTranslation(text, lang, sleepTimer = 1000) {
  const res = await translate(text, {to: lang});
  // Let's play nice with google-translate so we don't get blacklisted.
  await sleepFor(sleepTimer);
  return res;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function translateAll(text) {
  const results = [];
  asyncForEach(languages, async (lang) => {
    const res = await getTranslation(text, lang);
    results.push({
      text: res.text,
      lang,
      length: res.text.length,
    });
  });
  return results;
}

translateAll();
