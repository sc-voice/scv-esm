import SuttaCentralId from './sutta-central-id.mjs';
import SuidMap from './auto/suid-map.mjs';
import { logger } from "log-instance/index.mjs";
import AuthorsV2 from './authors-v2.mjs';
import {
  DBG_SUTTA_REF,
} from "./defines.mjs"

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
    const msg = 'SuttaRef.createFromString()';
    const dbg = DBG_SUTTA_REF;
    let refLower = str.toLowerCase();
    let segMatch = refLower.match(/:[-0-9.]*/);
    let segnum;
    let ref = refLower;
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
          dbg && console.log(msg, "[1]",  JSON.stringify({
            suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh}));
          if (iLow === i) {
            let nikaya = refLower.replace(/[-0-9.:]+[a-z\/]*/, '');
            if (suid.startsWith(nikaya)) {
              keys.push(suid);
              scid = `${refLower.split('/')[0]}`;
              dbg && console.log(msg, '[2]', JSON.stringify({
                nikaya, refLower,suid, keys, scid}));
            }
            break;
          }
          iLow = i;
        } else if (cmpLow <= 0 && cmpHigh <= 0) {
          scid = `${refLower.split('/')[0]}`;
          dbg && console.log(msg, "[3]", JSON.stringify({
            refLower, scid, suid, sutta_uid, cmpLow, cmpHigh, iLow, 
            i, iHigh}));
          keys.push(suid);
          break;
        }
        if (cmpLow > 0 && cmpHigh > 0) {
          dbg && console.log(msg, "[4]", JSON.stringify({
            suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh}));
          iHigh = i;
        } else if (cmpLow > 0) {
          dbg && console.log(msg, "[5]", JSON.stringify({
            suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh}));
          iHigh = i;
        } else if (cmpHigh > 0) {
          dbg && console.log(msg, "[6]",  JSON.stringify({
            suid, sutta_uid, cmpLow, cmpHigh, iLow, i, iHigh}));
          if (iLow === i) {
            let eMsg = msg+ ` ${suid}, (${str}?), ${suids[i+1]})`;
            throw new Error(eMsg);
          } else {
            iLow = i;
          } 
        }
      } // while
    } else {
      keys = suids.filter((k) => {
        return compareLow(k, sutta_uid) <= 0 && 
          compareHigh(sutta_uid, k) <= 0;
      });
      dbg && console.log(msg, "[7]", JSON.stringify({keys, suid}));
    }
    let suttaRef;
    if (keys.length !== 1) {
      let eMsg = `${msg} ${str} => keys?:${keys.length}`;
      throw new Error(eMsg);
    }
    dbg && console.log(msg, "[8]", JSON.stringify({str, keys, scid}));

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
      return SuttaRef.createWithError(strOrObj, defaultLang, suids);
    } catch(e) {
      let args = JSON.stringify(strOrObj);
      let msg = `SuttaRef.create() ${args} => ${e.message}`;
      logger.warn(msg);
    }

    return null;
  }

  static createOpts(strOrObj, opts={}) {
    let {
      defaultLang = 'pli',
      suids = SUIDS,
      normalize = false,
    } = opts;

    if (strOrObj == null) {
      return undefined;
    }

    let sref = typeof strOrObj === 'string'
      ? SuttaRef.create(strOrObj, defaultLang, suids)
      : SuttaRef.create(Object.assign({},strOrObj), defaultLang, suids);

    if (normalize && sref) {
      let { sutta_uid, lang, author, segnum } = sref;
      if (sutta_uid && author == null) {
        sref.author = AuthorsV2.suttaAuthor(sref);
      }
    }

    return sref;
  }

  static createWithError(strOrObj, defaultLang="pli", suids=SUIDS) {
    if (typeof strOrObj === "string") {
      return SuttaRef.createFromString(strOrObj, defaultLang, suids);
    } else if (typeof strOrObj === "object") {
      return SuttaRef.createFromObject(strOrObj, defaultLang, suids);
    }
  }

  toString() { 
    let { sutta_uid, lang, author, segnum } = this;
    let scid = segnum
      ? `${sutta_uid}:${segnum}`
      : sutta_uid;
    return lang 
      ? author ? `${scid}/${lang}/${author}` : `${scid}/${lang}`
      : scid;
  }
}
