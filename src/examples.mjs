import Examples from "./auto/examples.mjs";
import LOG_INSTANCE from "log-instance";
const { logger } = LOG_INSTANCE;

const REG_EXP_MAP = {};

function sanitizePattern(pattern) {
  if (!pattern) {
    throw new Error("search pattern is required");
  }
  const MAX_PATTERN = 256;
  var excess = pattern.length - MAX_PATTERN;
  if (excess > 0) {
    throw new Error(
      `Example too long by ${excess} characters: ${pattern}`
    );
  }
  // replace quotes (code injection on grep argument)
  pattern = pattern.replace(/["']/g, ".");
  // eliminate tabs, newlines and carriage returns
  pattern = pattern.replace(/\s/g, " ");
  // remove control characters
  pattern = pattern.replace(/[\u0000-\u001f\u007f]+/g, "");
  // must be valid
  new RegExp(pattern);

  return pattern;
}

function regExpLangExamples(lang) {
  var reLang = REG_EXP_MAP[lang];
  if (!reLang) {
    let langExamples = Examples[lang];
    if (langExamples == null) {
      return null;
    }
    langExamples = langExamples.map(e => sanitizePattern(e));
    let pat = langExamples.join("|\\b");
    reLang = new RegExp(`\\b${pat}`, "gimu");
    REG_EXP_MAP[lang] = reLang;

    // nodejs v16.16.0 11/15/2022
    // --------------------------
    // Javascript runtime optimization is triggered
    // when the RegExp is executed TWICE.
    // Use the before() method to pre-optimize 
    // the regular expression so that
    // unit test times match long-term behavior
  }
  reLang.lastIndex = 0; // reset state (reLang is a global RegExp)
  return reLang;
}

Object.defineProperty(Examples, "isExample", {
  value: (text,lang) => {
    let pat = text;
    let re = new RegExp(`^${pat}$`, "iu");
    let match = (eg) => pat.toLowerCase() === eg.toLowerCase() || re.test(eg);
    if (lang) {
      let egLang = Examples[lang];

      return egLang
        ? egLang.find(match) && lang || undefined
        : undefined;
    }

    return Object.keys(Examples)
      .filter(k => k !== 'comment' && k !== 'authors')
      .reduce((a,l,i) => {
        let langExamples = Examples[l];
        if (langExamples == null) {
          return a;
        }
        if (a) {
          return a;
        }
        return langExamples.find(match) && l;
      }, undefined)
  }
});

Object.defineProperty(Examples, "test", {
  value: (str, lang='en') => regExpLangExamples(lang).test(str),
});

Object.defineProperty(Examples, "replaceAll", {
  value: (text,template='$&',lang='en') => {
    let re = regExpLangExamples(lang);
    return re ? text.replaceAll(re, template) : text;
  }
});

export default Examples;

