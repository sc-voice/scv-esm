import AUTHORSV2 from "./auto/authors-v2.mjs";

export default class AuthorsV2 {
  static get authors() {
    return Object.assign({}, AUTHORSV2);
  }

  static authorInfo(author) {
    const msg = "authros-v2.authorInfo() ";
    let info = Object.keys(AUTHORSV2).reduce((a,k) => {
      let ak = AUTHORSV2[k];
      if (ak.author === author) {
        a.push(ak);
      }
      return a;
    }, []);
    return info[0];
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


