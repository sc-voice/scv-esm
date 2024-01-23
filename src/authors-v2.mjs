import AUTHORSV2 from "./auto/authors-v2.mjs";

export default class AuthorsV2 {
  static get authors() {
    return Object.assign({}, AUTHORSV2);
  }

  static authorInfo(author, lang) {
    const msg = "AuthorsV2.authorInfo() ";
    const dbg = 0;
    let keys = Object.keys(AUTHORSV2);
    let authorInfo =  keys.reduce((a,k)=>{
      let info = AUTHORSV2[k];
      if (info.author !== author) {
        return a;
      }
      if (info.lang === lang || a==null) {
        dbg && console.log(msg, '[1]info', info.author);
        return info;
      }
      return a;
    }, undefined);

    dbg && console.log(msg, '[2]info', author, authorInfo);
    return authorInfo;
  }

  static find(opts={}) {
    let { author, exampleVersion, lang, sutta, vinaya } = opts;
    let keys = Object.keys(AUTHORSV2);
    return keys
      .filter(k=>{
        let info = AUTHORSV2[k];
        return (
          (exampleVersion == null || 
            info.exampleVersion >= exampleVersion) &&
          (author == null || info.author === author) &&
          (lang == null || info.lang === lang) &&
          (sutta == null || sutta === !!info.sutta) &&
          (vinaya == null || vinaya === !!info.vinaya) 
        );
      })
      .map(k=>AUTHORSV2[k])
      .sort(AuthorsV2.compareInfo);
  }

  static langAuthor(lang, opts={}) {
    const msg = "AuthorsV2.langAuthor()";
    const dbg = 0;
    let {
      category='sutta',
    } = opts;
    let info =  Object.keys(AUTHORSV2).reduce((a,k)=>{
      let info = AUTHORSV2[k];
      switch (category) {
        case 'vinaya':
          if (!info.vinaya) {
            return a;
          }
          break;
        default:
        case 'sutta':
          if (!info.sutta) {
            return a;
          }
      }
      if (info.lang === lang) {
         if (a == null) {
           dbg && console.log(msg, '[1]lang', info.name);
           return info;
         }
         let cmp = AuthorsV2.compare(info.author, a?.author);
         dbg && console.log(msg, '[2]compare', info.name, cmp);
         if (cmp === 0) {
           return a;
         }
         if (cmp > 0) {
           return info;
         }
      }
      return a;
    }, undefined);
    return info && info.author;
  }

  static compareInfo(info1, info2) {
    if (info1 === info2) {
      return 0;
    }
    if (!info1) {
      return 1;
    }
    if (!info2) {
      return -1;
    }
    let cmp = Number(info2.exampleVersion) - Number(info1.exampleVersion);
    if (cmp === 0) {
      cmp = info1.author.localeCompare(info2.author);
    }
    if (cmp === 0) {
      cmp = info1.lang.localeCompare(info2.lang);
    }
    return cmp;
  }

  static compare(author1, author2) {
    const msg = "authors-v2.compare() ";
    const dbg = 0;
    author1 = !!author1 ? author1 : '';
    author2 = !!author2 ? author2 : '';
    let noauthor = {};
    let info1 = AuthorsV2.authorInfo(author1) || noauthor;
    let info2 = AuthorsV2.authorInfo(author2) || noauthor;

    if (info1 === info2) {
      dbg && console.trace(msg, '[1]same', author1, author2, info1?.author);
      return 0;
    }
    if (!info1) {
      dbg && console.log(msg, '[2]!info1');
      return 1;
    }
    if (!info2) {
      dbg && console.log(msg, '[3]!info2');
      return -1;
    }

    let cmp = info1.exampleVersion - info2.exampleVersion;
    dbg && console.log(msg, '[4]exampleVersion', cmp);
    if (!cmp) {
      cmp = author1.localeCompare(author2);
      dbg && console.log(msg, '[5]author2', cmp);
    }
    if (!cmp) {
      let sutta1 = info1.sutta ? 1 : 0;
      let sutta2 = info2.sutta ? 1 : 0;
      cmp = sutta1 - sutta2;
      dbg && console.log(msg, '[6]sutta', cmp);
    }
    if (!cmp) {
      let vinaya1 = info1.vinaya ? 1 : 0;
      let vinaya2 = info2.vinaya ? 1 : 0;
      cmp = vinaya1 - vinaya2;
      dbg && console.log(msg, '[7]vinaya', cmp);
      return cmp;
    }
    return cmp;
  }
}


