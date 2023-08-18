import AUTHORSV2 from "./auto/authors-v2.mjs";

export default class AuthorsV2 {
  static get authors() {
    return Object.assign({}, AUTHORSV2);
  }

  static authorInfo(author) {
    return AUTHORSV2[author];
  }

  static langAuthor(lang) {
    let info =  Object.keys(AUTHORSV2).reduce((a,k)=>{
      let info = AUTHORSV2[k];
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
    let info1 = AuthorsV2.authorInfo(author1);
    let info2 = AuthorsV2.authorInfo(author2);

    if (info1 === info2) {
      return 0;
    }
    if (!info1) {
      return 1;
    }
    if (!info2) {
      return -1;
    }

    return (info1.exampleVersion - info2.exampleVersion) || 
      author2.localeCompare(author1);
  }
}


