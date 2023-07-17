import SuttaCentralId from './sutta-central-id.mjs';
import SuidMap from './auto/suid-map.mjs';
import { logger } from "log-instance/index.mjs";

const SUIDS = Object.keys(SuidMap).sort(SuttaCentralId.compareLow);

export default class SuttaRef {

  constructor({ sutta_uid, lang, author, segnum, scid }) {
    if (!sutta_uid || !sutta_uid.length || /\//.test(sutta_uid)) {
      throw new Error('use SuttaRef.create(${sutta_uid})');
    }
    scid = scid || `${sutta_uid}:${segnum}`;

    Object.assign(this, {
      sutta_uid, // file/document id (e.g., an1.1-10)
      lang,      // translation language (e.g., en)
      author,    // translator (e.g., sujato)
      segnum,    // segment number (e.g., 1.1)
      scid,      // segment key (e.g., an1.2:1.1)
    });
  }

  static createFromString(str='', defaultLang="pli", suids=SUIDS) {
    const msg = "SuttaRef.createFromString() ";
    let refLower = str.toLowerCase();
    let segMatch = refLower.match(/:[-0-9.]*/);
    let segnum;
    let ref = refLower;
    let dbg = 0;
    if (segMatch) {
      let [segPart]  = segMatch;
      segnum = segPart.substring(1);
      ref = ref.replace(segPart,'');
    }
    let [sutta_uid, lang=defaultLang, author] = ref
      .replace(/ /gu, "")
      .split("/");
    if (author == null && lang === 'pli') {
      author = 'ms';
    }
    let { compareLow, compareHigh } = SuttaCentralId;
    let keys = [];
    let scid;
    if (suids === SUIDS) {
      let nSuids = suids.length;
      let iLow = 0;
      let iHigh = nSuids;
      while (iLow < iHigh) {
        let i = Math.floor((iLow+iHigh)/2);
        let suid = suids[i];
        let cmpLow = compareLow(suid, sutta_uid);
        let cmpHigh = compareHigh(sutta_uid, suid);
        if (cmpLow < 0 && cmpHigh < 0) {
          dbg && console.log(msg, "DEBUG1", 
            {suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh});
          if (iLow === i) {
            let nikaya = refLower.replace(/[0-9.:]+[a-z\/]*/, '');
            if (suid.startsWith(nikaya)) {
              keys.push(suid);
              scid = `${refLower.split('/')[0]}`;
              dbg && console.log(msg, 'DEBUG1.5', {nikaya, refLower,suid, keys, scid} );
            }
            break;
          }
          iLow = i;
        } else if (cmpLow <= 0 && cmpHigh <= 0) {
          scid = `${refLower.split('/')[0]}`;
          dbg && console.log(msg, "DEBUG2", 
            {refLower, scid, suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh});
          keys.push(suid);
          break;
        }
        if (cmpLow > 0 && cmpHigh > 0) {
          dbg && console.log(msg, "DEBUG3", 
            {suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh});
          iHigh = i;
        } else if (cmpLow > 0) {
          dbg && console.log(msg, "DEBUG4", 
            {suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh});
          iHigh = i;
        } else if (cmpHigh > 0) {
          dbg && console.log(msg, "DEBUG5", 
            {suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh});
          iLow = i;
        }
      } // while
    } else {
      keys = suids.filter((k) => {
        return compareLow(k, sutta_uid) <= 0 && compareHigh(sutta_uid, k) <= 0;
      });
      dbg && console.log(msg, "DEBUG6", {keys, suid});
    }
    let suttaRef;
    if (keys.length !== 1) {
      throw new Error(`SuttaRef.createFromString(${str}) invalid`);
    }
    dbg && console.log(msg, "DEBUG7", {str, keys, scid});

    suttaRef = new SuttaRef({
      sutta_uid: keys[0],
      lang,
      author,
      segnum,
      scid,
    });
    return suttaRef;
  }

  static createFromObject(obj, defaultLang="pli", suids=SUIDS) {
    const msg = "SuttaRef.createFromObject() ";
    let parsed = SuttaRef.createFromString(
      obj.sutta_uid,
      obj.lang || defaultLang
    );
    let { sutta_uid, lang, author, segnum, scid} = parsed || {};

    if (obj.translator) {
      author = obj.translator; // legacy synonym
    }
    if (obj.author_uid) {
      author = obj.author_uid; // mlDoc
    }
    if (obj.author) {
      author = obj.author;
    }
    if (obj.scid) {
      scid = obj.scid;
    }
    let suttaRef = new SuttaRef({
      sutta_uid,
      lang,
      author,
      segnum: segnum || obj.segnum,
      scid,
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
      let args = JSON.stringify(strOrObj);
      let msg = `SuttaRef.create() ${args} => ${e.message}`;
      logger.warn(msg);
    }

    return null;
  }

  toString() { 
    let { sutta_uid, lang, author, segnum } = this;
    return segnum 
      ? `${sutta_uid}:${segnum}/${lang}/${author}`
      : `${sutta_uid}/${lang}/${author}`;
  }
}
