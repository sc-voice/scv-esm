import AUTHORS from "./auto/authors.mjs";

export default class Authors {
  static get authors() {
    return Object.assign({}, AUTHORS);
  }

  static authorInfo(author) {
    return AUTHORS[author];
  }

  static langAuthor(lang) {
    return Object.keys(AUTHORS).reduce((a,author)=>{
      let info = AUTHORS[author];
      if (info.lang === lang) {
         if (a == null) {
           return author;
         }
         let cmp = Authors.compare(author, a);
         if (cmp === 0) {
           return a;
         }
         return  cmp < 0 ? a : author;
      }
      return a;
    }, undefined);
  }

  static compare(author1, author2) {
    let info1 = Authors.authorInfo(author1);
    let info2 = Authors.authorInfo(author2);

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


