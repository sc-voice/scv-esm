import AUTHORSV2 from "./auto/authors-v2.mjs";
import { default as SuttaRef } from './sutta-ref.mjs';
import { DBG, } from './defines.mjs';

import { default as  suidMap } from './auto/suid-map.mjs';

export default class AuthorsV2 {
  static get authors() {
    return Object.assign({}, AUTHORSV2);
  }

  static authorInfo(author, lang) {
    const msg = "AuthorsV2.authorInfo() ";
    const dbg = DBG.AUTHOR;
    const dbgv = DBG.VERBOSE && dbg;
    let keys = Object.keys(AUTHORSV2);
    let authorInfo = keys.reduce((a,k)=>{
      let info = AUTHORSV2[k];
      if (info.author !== author) {
        return a;
      }
      if (info.lang === lang || a==null) {
        dbgv && console.log(msg, '[1]info', info.author);
        return info;
      }
      dbgv && console.log(msg, '[2]!lang', info.lang, info.author);
      return a;
    }, undefined);
    dbgv && console.log(msg, '[3]info', author, authorInfo);
    return authorInfo;
  }

  static buildAuthorStats(depth=2) {
    let suids = Object.keys(suidMap);
    let map = suids.reduce((aMap,suid)=>{
      let transObj = suidMap[suid];
      let transKeys = Object.keys(transObj);
      transKeys.forEach(transKey=>{
        let [ ignore, lang, author ] = transKey.split('/');
        let langAuthor = `${lang}:${author}`;
        let authLangEntry = aMap[langAuthor] = aMap[langAuthor] || {};

        let transDir = transObj[transKey];
        let dirParts = transDir.split('/');
        for (let end=1; end <= Math.min(depth,dirParts.length); end++) {
          let key = dirParts.slice(0, end).join('/');
          authLangEntry[key] = authLangEntry[key] || 0;
          authLangEntry[key]++;
        }
      });
      return aMap;
    }, {});

    return map;
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
    const dbg = DBG.AUTHOR;
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
         let cmp = AuthorsV2.compare(info.author, a && a.author);
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
    const msg = "AuthorsV2.compareInfo()";
    const dbg = DBG.AUTHOR;
    const dbgv = DBG.VERBOSE && dbg;
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
      let deepl1 = info1.author.startsWith('ebt-deepl') ? 1 : 2;
      let deepl2 = info2.author.startsWith('ebt-deepl') ? 1 : 2;
      let cmp = deepl1 - deepl2;
      //if (info1.author.startsWith('ebt-deepl')) {
        //dbgv && console.log(msg, '[1]info1', info1.name);
        //cmp = -1;
      //} else if (info2.author.startsWith('ebt-deepl')) {
        //dbgv && console.log(msg, '[2]info2', info2.name);
        //cmp = 1;
      //}
    }
    if (cmp === 0) {
      cmp = info1.lang.localeCompare(info2.lang);
    }
    return cmp;
  }

  static compare(author1, author2) {
    const msg = "authors-v2.compare() ";
    const dbg = 0 || DBG.AUTHOR;
    author1 = !!author1 ? author1 : '';
    author2 = !!author2 ? author2 : '';
    let noauthor = {author:'no-author'};
    let info1 = AuthorsV2.authorInfo(author1) || noauthor;
    let info2 = AuthorsV2.authorInfo(author2) || noauthor;

    if (info1 === info2) {
      dbg && console.trace(msg, '[1]same', author1, author2, 
        info1 && info1.author);
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

    let cmp = 0;
    if (cmp === 0) {
      let deepl1 = info1.author.startsWith('ebt-deepl') ? 1 : 2;
      let deepl2 = info2.author.startsWith('ebt-deepl') ? 1 : 2;
      cmp  = deepl1 - deepl2;
      dbg && console.log(msg, '[4]deepl', 
        info1.author, info2.author, cmp);
    }

    if (cmp === 0) {
      cmp = info1.exampleVersion - info2.exampleVersion;
      dbg && console.log(msg, '[5]exampleVersion', 
        info1.author, info2.author, cmp);
    }
    if (!cmp) {
      cmp = author1.localeCompare(author2);
      dbg && console.log(msg, '[6]author2', author1, author2, cmp);
    }
    if (!cmp) {
      let sutta1 = info1.sutta ? 1 : 0;
      let sutta2 = info2.sutta ? 1 : 0;
      cmp = sutta1 - sutta2;
      dbg && console.log(msg, '[7]sutta', cmp);
    }
    if (!cmp) {
      let vinaya1 = info1.vinaya ? 1 : 0;
      let vinaya2 = info2.vinaya ? 1 : 0;
      cmp = vinaya1 - vinaya2;
      dbg && console.log(msg, '[8]vinaya', cmp);
      return cmp;
    }
    return cmp;
  }

  static suttaAuthor(suttaRef) {
    const msg = 'AuthorsV2.suttaAuthor()';
    const dbg = DBG.AUTHOR;
    let { 
      sutta_uid, lang, author 
    } = SuttaRef.create(suttaRef);
    const MAX_SCORE = 10000;
    let bPaths = suidMap[sutta_uid];
    if (bPaths == null) {
      return undefined;
    }

    let bpks = Object.keys(bPaths);
    let score = -1; // default
    let suttaAuthor = bpks.reduce((a,bpk)=>{
      let bpv = bPaths[bpk] || '';
      let [ ignore, bpLang, bpAuthor ] = bpk.split('/');
      let info = AuthorsV2.authorInfo(bpAuthor, bpLang); 
      let { stats } = info;
      let bpvParts = bpv && bpv.split('/');
      let statsScore = stats 
        ? (stats[bpv]||0) + (stats[bpvParts[0]]||0)/MAX_SCORE
        : 0;
      let bpScore = bpAuthor.endsWith('ebt-deepl') ? 1 : statsScore;
      if (bpLang === lang) {
        if (bpAuthor === author) {
          a = bpAuthor;
          score = MAX_SCORE;
          dbg && console.log(msg, '[1]bpAuthor', 
            {bpLang, bpAuthor, bpk, bpv, bpScore});
        } else if (bpScore > score) {
          score = bpScore;
          a = bpAuthor;
          dbg && console.log(msg, '[2]bpScore', 
            {bpLang, lang, bpk, bpv, bpScore});
        }
      }
      return a;
    }, author);

    dbg && console.log(msg, '[3]suttaAuthor', suttaAuthor); 
    return suttaAuthor;
  }
}


