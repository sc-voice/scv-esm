import Examples from "./auto/examples.mjs";

Object.defineProperty(Examples, "isExample", {
  value: (text,lang) => {
    let tlc = text.toLowerCase();
    if (lang) {
      let example = Examples[lang].find(eg => eg.toLowerCase() === tlc);
      return example == null ? undefined : lang;
    }

    return Object.keys(Examples)
      .filter(k => k !== 'comment' && k !== 'authors')
      .reduce((a,l,i) => {
        let langExamples = Examples[l];
        if (a) { return a; }
        let example = langExamples.find(eg => eg.toLowerCase() === tlc);
        return example == null ? a : l;
      }, undefined)
  }
});

export default Examples;

