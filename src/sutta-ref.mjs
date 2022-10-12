import SuttaCentralId from './sutta-central-id.mjs';
import SuidMap from './auto/suid-map.mjs';
import { logger } from "log-instance";

const SUIDS = Object.keys(SuidMap).sort(SuttaCentralId.compareLow);

export default class SuttaRef {

  constructor({ sutta_uid, lang, author, segnum }) {
    if (!sutta_uid || !sutta_uid.length || /\//.test(sutta_uid)) {
      throw new Error('use SuttaRef.create(${sutta_uid})');
    }

    Object.assign(this, {
      sutta_uid,
      lang,
      author,
      segnum,
    });
  }

  static createFromString(str, defaultLang="pli", suids=SUIDS) {
    let refLower = str.toLowerCase();
    let [ref, segnum] = refLower.split(":");
    let [sutta_uid, lang=defaultLang, author] = ref
      .replace(/ /gu, "")
      .split("/");
    if (author == null && lang === 'pli') {
      author = 'ms';
    }
    let { compareLow, compareHigh } = SuttaCentralId;
    let keys = suids.filter((k) => {
      return compareLow(k, sutta_uid) <= 0 && compareHigh(sutta_uid, k) <= 0;
    });
    let suttaRef;
    if (keys.length === 1) {
      suttaRef = new SuttaRef({
        sutta_uid: keys[0],
        lang,
        author,
        segnum,
      });
    } else {
      throw new Error(`SuttaRef.createFromString(${str}) invalid`);
    }
    return suttaRef;
  }

  static createFromObject(obj, defaultLang="pli", suids=SUIDS) {
    let parsed = SuttaRef.createFromString(
      obj.sutta_uid,
      obj.lang || defaultLang
    );
    let { sutta_uid, lang, author, segnum } = parsed || {};
    if (obj.translator) {
      author = obj.translator; // legacy synonym
    }
    if (obj.author) {
      author = obj.author;
    }
    let suttaRef = new SuttaRef({
      sutta_uid,
      lang,
      author,
      segnum: segnum || obj.segnum,
    });

    return suttaRef;
  }

  static create(strOrObj, defaultLang="pli", suids=SUIDS) {
    try {
      if (typeof strOrObj === "string") {
        return SuttaRef.createFromString(strOrObj, defaultLang, suids);
      } else if (typeof strOrObj === "object") {
        return SuttaRef.createFromObject(strOrObj, defaultLang, suids);
      }
    } catch(e) {
      logger.warn(`SuttaRef.create()`, JSON.stringify(strOrObj), '=>', e.message);
    }

    return null;
  }

  toString() {
    let { sutta_uid, lang, author, segnum } = this;
    return segnum 
      ? `${sutta_uid}/${lang}/${author}:${segnum}`
      : `${sutta_uid}/${lang}/${author}`;
  }
}
