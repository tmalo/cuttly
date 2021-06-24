const URL = require("url").URL;
const axios = require("axios");
const querystring = require("querystring");
const cuttlyURL = "https://cutt.ly/api/api.php";

const cuttlyErrorCode = [
  "Not an url",
  "the link has already been shortened",
  "the entered link is not a link",
  "the preferred link name is already taken",
  "Invalid API key",
  "the link has not passed the validation. Includes invalid characters",
  "The link provided is from a blocked domain",
  "OK - the link has been shortened",
  "Link is local",
];

const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

function CuttlyError(code, url) {
  var instance = new Error(cuttlyErrorCode[code]);
  instance.code = code;
  instance.cuttlyUrl = url;

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, CuttlyError);
  }
  return instance;
}

CuttlyError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(CuttlyError, Error);
} else {
  CuttlyError.__proto__ = Error;
}

const buildShareUrl = (cuttlyKey, longurl) => {
  const url = cuttlyURL;
  return (
    url +
    "?" +
    querystring.stringify({
      short: encodeURIComponent(longurl),
      key: cuttlyKey,
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

    const isLocalhost = /http(s?):\/\/(localhost|127.0.0.1)(.+)/;
    if (isLocalhost.test(longurl)) {
      resolve({
        date: new Date(),
        shortLink: longurl,
        fullLink: longurl,
        title: "",
        status: 8,
      });
      return;
    }

    const instance = axios.create({
      headers: { Accept: "application/json, text/plain, */*" },
    });
    try {
      const destUrl = buildShareUrl(key, longurl);
      return instance.get(destUrl).then(
        (response) => {
          const answer = response.data;
          if (answer.url.status === 7) {
            resolve(answer.url);
          } else if (answer.url.status === 1) {
            reject(new CuttlyError(answer.url.status, destUrl));
          } else {
            reject(new CuttlyError(answer.url.status, destUrl));
            // reject(new Error(cuttlyErrorCode[answer.url.status]));
          }
        },
        (error) => {
          reject(error);
        }
      );
    } catch (ex) {
      reject(ex);
    }
  });
