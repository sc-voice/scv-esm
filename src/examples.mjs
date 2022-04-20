import Examples from "./auto/examples.mjs";

Object.defineProperty(Examples, "isExample", {
  value: (text,lang) => {
    let pat = text;
    let re = new RegExp(`^${pat}$`, "iu");
    if (lang) {
      let example = Examples[lang].find(eg => re.test(eg));
      return example == null ? undefined : lang;
    }

    return Object.keys(Examples)
      .filter(k => k !== 'comment' && k !== 'authors')
      .reduce((a,l,i) => {
        let langExamples = Examples[l];
        if (a) { return a; }
        let example = langExamples.find(eg => re.test(eg));
        return example == null ? a : l;
      }, undefined)
  }
});

export default Examples;

