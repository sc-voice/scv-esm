import AUTHORSV2 from "./auto/authors-v2.mjs";

export default class AuthorsV2 {
  static get authors() {
    return Object.assign({}, AUTHORSV2);
  }

  static authorInfo(author, lang) {
    const msg = "AuthorsV2.authorInfo() ";
    let keys = Object.keys(AUTHORSV2);
    return keys.reduce((a,k)=>{
      let info = AUTHORSV2[k];
      if (info.author !== author) {
        return a;
      }
      return info.lang === lang || a==null
        ? info
        : a;
    }, undefined);
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
          (sutta == null || sutta === info.sutta) &&
          (vinaya == null || vinaya === info.vinaya) 
        );
      })
      .map(k=>AUTHORSV2[k])
      .sort(AuthorsV2.compareInfo);
  }

  static langAuthor(lang, opts={}) {
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
           return info;
         }
         let cmp = AuthorsV2.compare(info, a);
         if (cmp === 0) {
           return a;
         }
         return  cmp < 0 ? a : info;
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
    author1 = !!author1 ? author1 : '';
    author2 = !!author2 ? author2 : '';
    let noauthor = {};
    let info1 = AuthorsV2.authorInfo(author1) || noauthor;
    let info2 = AuthorsV2.authorInfo(author2) || noauthor;

    if (info1 === info2) {
      return 0;
    }
    if (!info1) {
      return 1;
    }
    if (!info2) {
      return -1;
    }

    let cmp = info1.exampleVersion - info2.exampleVersion;
    if (!cmp) {
      cmp = author1.localeCompare(author2);
    }
    if (!cmp) {
      let sutta1 = info1.sutta ? 1 : 0;
      let sutta2 = info2.sutta ? 1 : 0;
      cmp = sutta1 - sutta2;
    }
    if (!cmp) {
      let vinaya1 = info1.vinaya ? 1 : 0;
      let vinaya2 = info2.vinaya ? 1 : 0;
      cmp = vinaya1 - vinaya2;
      return cmp;
    }
    return cmp;
  }
}


