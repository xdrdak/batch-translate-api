const translate = require('google-translate-api');
const Utfstring = require('utfstring');
const languages = require('./languages');

// Utility Functions

const sleepFor = ms => new Promise(res => setTimeout(res, ms));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

// Translation Functions

async function getTranslation(text, lang, sleepTimer = 150) {
  const res = await translate(text, {to: lang});
  // Let's play nice with google-translate so we don't get blacklisted.
  await sleepFor(sleepTimer);
  return res;
}

async function translateAll(text) {
  let results = [];
  await asyncForEach(languages, async (lang) => {
    const res = await getTranslation(text, lang);
    results.push({
      text: res.text,
      lang,
      length: Utfstring.length(res.text),
    });
  });

  return results;
}

module.exports = {
  getTranslation,
  translateAll,
}