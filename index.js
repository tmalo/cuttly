const URL = require("url").URL;
const axios = require("axios");
const querystring = require("querystring");
const cuttlyURL = "https://cutt.ly/api/api.php";

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

function CuttlyError(code) {
  this.name = "CuttlyError";
  this.code = code;
  this.message = cuttlyErrorCode[code];
  this.stack = new Error().stack;
}
CuttlyError.prototype = new Error();

const cuttlyErrorCode = [
  "Not an url",
  "the link has already been shortened",
  "the entered link is not a link",
  "the preferred link name is already taken",
  "Invalid API key",
  "the link has not passed the validation. Includes invalid characters",
  "The link provided is from a blocked domain",
  "OK - the link has been shortened",
];

const buildShareUrl = (cuttlyKey, longurl) => {
  const url = cuttlyURL;
  return (
    url +
    "?" +
    querystring.stringify({
      key: cuttlyKey,
      short: encodeURI(longurl),
    })
  );
};

/**
 *
 * @param {String} key Cuttly API Key
 * @param {String} longurl Url to shorten
 * @returns Url Object, @see https://cutt.ly/api-documentation/cuttly-links-api
 */
exports.shortenUrl = (key, longurl) =>
  new Promise((resolve, reject) => {
    if (!stringIsAValidUrl(longurl)) {
      reject(new CuttlyError(0));
      return;
    }

    const instance = axios.create({
      headers: { Accept: "application/json, text/plain, */*" },
    });

    instance.get(buildShareUrl(key, longurl)).then(
      (response) => {
        const answer = response.data;
        if (answer.url.status === 7) {
          resolve(answer.url);
        } else if (answer.url.status === 1) {
          console.log(answer.url);
          reject(new CuttlyError(answer.url.status));
        } else {
          reject(new CuttlyError(answer.url.status));
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
