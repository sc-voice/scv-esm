import Examples from "./auto/examples.mjs";

Object.defineProperty(Examples, "isExample", {
  value: (text,lang) => {
    if (lang) {
      let iExample = Examples[lang].indexOf(text);
      return iExample < 0 ? undefined : lang;
    }

    return Object.keys(Examples)
      .filter(k => k !== 'comment' && k !== 'authors')
      .reduce((a,k,i) => {
        let langExamples = Examples[k];
        if (a) { return a; }
        let iExample = langExamples.indexOf(text);
        return iExample < 0 ? a : k;
      }, undefined)
  }
});

export default Examples;

