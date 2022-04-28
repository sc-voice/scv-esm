import AUTHORS from "./auto/authors.mjs";

export default class Authors {
  static get authors() {
    return Object.assign({}, AUTHORS);
  }

  static authorInfo(author) {
    return AUTHORS[author];
  }
}


