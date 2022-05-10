import Examples from "./auto/examples.mjs";

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

export default Examples;

