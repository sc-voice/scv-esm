import Examples from "./auto/examples.mjs";

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


Object.defineProperty(Examples, "isExample", {
  value: (text,lang) => {
    let pat = text;
    let re = new RegExp(`^${pat}$`, "iu");
    let match = (eg) => pat.toLowerCase() === eg.toLowerCase() || re.test(eg);
    if (lang) {
      return Examples[lang].find(match) && lang || undefined;
    }

    return Object.keys(Examples)
      .filter(k => k !== 'comment' && k !== 'authors')
      .reduce((a,l,i) => {
        let langExamples = Examples[l];
        return a || langExamples.find(match) && l || a;
      }, undefined)
  }
});

Object.defineProperty(Examples, "regExpLangExamples", {
  value: (lang) => {
    var reLang = REG_EXP_MAP[lang];
    if (!reLang) {
      let langExamples = Examples[lang];
      if (langExamples == null) {
        throw new Error(`No examples for ${lang}`);
      }
      langExamples = langExamples.map(e => sanitizePattern(e));
      let pat = langExamples.join("|\\b");
      reLang = new RegExp(`\\b${pat}`, "gimu");
      REG_EXP_MAP[lang] = reLang;
    }
    return reLang;
  }
});

export default Examples;

