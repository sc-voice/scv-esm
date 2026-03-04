import { expect, describe, it } from "@sc-voice/vitest";
import { Authors, AuthorsV2 } from "../main.mjs";

describe("authors-v2", () => {
  it("authorInfo() => supported author info", async()=>{
    var ms = {
        lang: 'pli',
        type: "root",
        author: 'ms',
        name: ["The M.L. Maniratana Bunnag Dhamma Society Fund"],
        exampleVersion: 999999,
        sutta: true,
        vinaya: true,
    };
    var maggatr = {
        lang: 'es',
        type: "translation",
        name: ["Magga Translations"],
        examples: ["sutta"],
        sutta: true,
        vinaya: false,
        author: 'maggatr',
        exampleVersion: 1,
    };
    var sujato = {
        lang: 'en',
        type: "translation",
        name: ["Bhikkhu Sujato"],
        examples: ["sutta"],
        sutta: true,
        vinaya: false,
        author: 'sujato',
        exampleVersion: 1,
    };
    var brahmali = {
        lang: 'en',
        type: "translation",
        author: "brahmali",
        //category: ["vinaya"],
        name: ["Bhikkhu Brahmali"],
        vinaya: true,
        exampleVersion: 0,
    };
    var sabbamitta = {
        lang: 'de',
        type: "translation",
        name: ["Sabbamitta"],
        author: "sabbamitta",
        sutta: true,
        vinaya: false,
        examples: ["sutta"],
        exampleVersion: 1,
    };
    var soma = {
        lang: 'en',
        type: "translation",
        name: ["Bhikkhuni Soma"],
        author: "soma",
        sutta: true,
        exampleVersion: 0,
    };
    var kaz = {
        lang: 'jpn',
        type: "translation",
        name: ["竹原 一江"],
        examples: ['sutta'],
        author: "kaz",
        sutta: true,
        exampleVersion: 1,
    };
    var gnlaera = {
        lang: 'pt',
        type: "translation",
        name: [
          "Gabriel Laera",
          "Marco Quaresma",
          "Vitor Guimarães",
        ],
        author: "laera-quaresma",
        sutta: true,
        vinaya: false,
        examples: [ 'sutta' ],
        exampleVersion: 2,
    };
    var ebt_deepl_pt = {
        lang: 'pt',
        type: "translation",
        name: [
          "EBT-DeepL",
        ],
        author: "ebt-deepl",
        sutta: true,
        vinaya: false,
        examples: [ 'sutta' ],
        exampleVersion: 2,
    };
    var noeismet = {
        lang: 'fr',
        type: "translation",
        name: [
          "Noé Ismet",
        ],
        author: "noeismet",
        sutta: true,
        examples: [ 'sutta' ],
        exampleVersion: 1,
    };

    expect(AuthorsV2.authorInfo('soma', 'it')).toMatchObject(soma);
    expect(AuthorsV2.authorInfo('noeismet')).toMatchObject(noeismet);
    expect(AuthorsV2.authorInfo('laera-quaresma')).toMatchObject(gnlaera);
    expect(AuthorsV2.authorInfo('kaz')).toMatchObject(kaz);
    expect(AuthorsV2.authorInfo('soma')).toMatchObject(soma);
    expect(AuthorsV2.authorInfo('ms')).toMatchObject(ms);
    expect(AuthorsV2.authorInfo('sujato')).toMatchObject(sujato);
    expect(AuthorsV2.authorInfo('sabbamitta')).toMatchObject(sabbamitta);
    expect(AuthorsV2.authorInfo('brahmali')).toMatchObject(brahmali);

    expect(AuthorsV2.authorInfo('sabbamitta')).toMatchObject(sabbamitta);
  });
  it("authorInfo() v1 vs. v2", ()=>{
    let info1 = Authors.authorInfo('sujato');
    let info2 = AuthorsV2.authorInfo('sujato');

    expect(info1.author).toBe(info2.author);
    expect(info1.lang).toBe(info2.lang);
    expect(info1.exampleVersion).toBe(info2.exampleVersion);

    // Everything else is different
    expect(info1.category).not.toBe(info2.category);
    expect(info1.name).not.toBe(info2.name);
    expect(info1.sutta).not.toBe(info2.sutta);
    expect(info1.vinaya).not.toBe(info2.vinaya);
    expect(info1.examples).not.toBe(info2.examples);
    expect(info1.type).not.toBe(info2.type);
  });
  it("compare(a1,a2)", ()=>{
    let sujato = "sujato";
    let sabbamitta = "sabbamitta";
    let soma = "soma";
    let unknown = "unknown";
    let laera = "laera-quaresma";
    let ebtdeepl = "ebt-deepl";

    // equal
    expect(AuthorsV2.compare()).toBe(0);
    expect(AuthorsV2.compare(unknown,unknown)).toBe(0);
    expect(AuthorsV2.compare(undefined,undefined)).toBe(0);
    expect(AuthorsV2.compare(null,null)).toBe(0);
    expect(AuthorsV2.compare(undefined,null)).toBe(0);
    expect(AuthorsV2.compare(null,unknown)).toBe(0);
    expect(AuthorsV2.compare(sujato,sujato)).toBe(0);
    expect(AuthorsV2.compare(soma,soma)).toBe(0);

    // ascending
    expect(AuthorsV2.compare(undefined,soma)).toBe(-1);
    expect(AuthorsV2.compare(null,soma)).toBe(-1);
    expect(AuthorsV2.compare(unknown,soma)).toBe(1);
    expect(AuthorsV2.compare(unknown,sujato)).toBe(1);
    expect(AuthorsV2.compare(sujato,soma)).toBe(1);
    expect(AuthorsV2.compare(laera, ebtdeepl)).toBe(1);
    expect(AuthorsV2.compare(sabbamitta, sujato)).toBe(-1);

    // descending
    expect(AuthorsV2.compare(soma, sujato)).toBe(-1);
    expect(AuthorsV2.compare(ebtdeepl, laera)).toBe(-1);
    expect(AuthorsV2.compare(soma, undefined)).toBe(1);
    expect(AuthorsV2.compare(soma, null)).toBe(1);
    expect(AuthorsV2.compare(soma, unknown)).toBe(-1);
    expect(AuthorsV2.compare(sujato, unknown)).toBe(-1);
    expect(AuthorsV2.compare(sujato,sabbamitta)).toBe(1);
  });
  it("langAuthor sutta", ()=>{
    let opts = { category: 'sutta'};

    expect(AuthorsV2.langAuthor('ru')).toBe('sv');
    expect(AuthorsV2.langAuthor('es')).toBe('maggatr');
    expect(AuthorsV2.langAuthor('unknown')).toBeUndefined();
    expect(AuthorsV2.langAuthor('fr')).toBe('noeismet');
    expect(AuthorsV2.langAuthor('de')).toBe('sabbamitta');
    expect(AuthorsV2.langAuthor('en')).toBe('sujato');
    expect(AuthorsV2.langAuthor('jpn')).toBe('kaz');
    expect(AuthorsV2.langAuthor('pt')).toBe('laera-quaresma');

    expect(AuthorsV2.langAuthor('unknown', opts)).toBeUndefined();
    expect(AuthorsV2.langAuthor('ru', opts)).toBe('sv');
    expect(AuthorsV2.langAuthor('fr', opts)).toBe('noeismet');
    expect(AuthorsV2.langAuthor('de', opts)).toBe('sabbamitta');
    expect(AuthorsV2.langAuthor('en', opts)).toBe('sujato');
    expect(AuthorsV2.langAuthor('jpn', opts)).toBe('kaz');
    expect(AuthorsV2.langAuthor('pt', opts)).toBe('laera-quaresma');
  });
  it("langAuthor vinaya", ()=>{
    let opts = { category: 'vinaya'};

    expect(AuthorsV2.langAuthor('unknown')).toBeUndefined();
    expect(AuthorsV2.langAuthor('de')).toBe('sabbamitta');
    expect(AuthorsV2.langAuthor('en')).toBe('sujato');
    expect(AuthorsV2.langAuthor('jpn')).toBe('kaz');
    expect(AuthorsV2.langAuthor('pt')).toBe('laera-quaresma');

    expect(AuthorsV2.langAuthor('unknown', opts)).toBeUndefined();
    expect(AuthorsV2.langAuthor('de', opts)).toBeUndefined();
    expect(AuthorsV2.langAuthor('en', opts)).toBe('brahmali');
    expect(AuthorsV2.langAuthor('jpn', opts)).toBeUndefined();
    expect(AuthorsV2.langAuthor('pt', opts)).toBeUndefined();
  });
  it("TESTTESTfind() lang", ()=>{
    expect(AuthorsV2.find({lang:'es'})).toEqual([
      //AuthorsV2.authorInfo('ebt-deepl', 'es'),
      AuthorsV2.authorInfo('font'),
      AuthorsV2.authorInfo('maggatr'),
    ]);
    expect(AuthorsV2.find({lang:'pt'})).toEqual([
      AuthorsV2.authorInfo('laera-quaresma'),
      //AuthorsV2.authorInfo('ebt-deepl', 'pt'),
    ]);
    expect(AuthorsV2.find({lang:'ru'})).toEqual([
      AuthorsV2.authorInfo('khantibalo'),
      AuthorsV2.authorInfo('narinyanievmenenko'),
      AuthorsV2.authorInfo('sv'),
      AuthorsV2.authorInfo('syrkin'),
    ]);
    expect(AuthorsV2.find({lang:'jpn'})).toEqual([
      AuthorsV2.authorInfo('kaz'),
    ]);
    expect(AuthorsV2.find({lang:'de'})).toEqual([
      AuthorsV2.authorInfo('sabbamitta'),
      AuthorsV2.authorInfo('sonjabuege'),
    ]);
    expect(AuthorsV2.find({lang:'en', })).toEqual([
      AuthorsV2.authorInfo('sujato'),  // exampleVersion

      // alphabetical
      //AuthorsV2.authorInfo('anandajoti'),
      AuthorsV2.authorInfo('brahmali'),
      //AuthorsV2.authorInfo('davis'),
      AuthorsV2.authorInfo('kelly'),
      AuthorsV2.authorInfo('kovilo'),
      //AuthorsV2.authorInfo('patton'),
      AuthorsV2.authorInfo('soma'),
      AuthorsV2.authorInfo('suddhaso'),
    ]);
    expect(
      AuthorsV2.find({lang:'en', sutta:true, vinaya:false})
    ).toEqual([
      AuthorsV2.authorInfo('sujato'),  // exampleVersion

      // alphabetical
      //AuthorsV2.authorInfo('anandajoti'),
      //AuthorsV2.authorInfo('davis'),
      AuthorsV2.authorInfo('kelly'),
      AuthorsV2.authorInfo('kovilo'),
      //AuthorsV2.authorInfo('patton'),
      AuthorsV2.authorInfo('soma'),
      AuthorsV2.authorInfo('suddhaso'),
    ]);
  });
  it("find() exampleVersion", ()=>{
    let ainfo = AuthorsV2.find({exampleVersion:1});
    let authors = ainfo.map(a=>`${a.lang}/${a.author}`).sort();
    expect(authors).toEqual([
      'de/sabbamitta',
      'en/sujato',
      //'es/ebt-deepl',
      'fr/noeismet',
      //'it/ebt-deepl',
      'jpn/kaz',
      'pli/ms',
      //'pt/ebt-deepl',
      'pt/laera-quaresma',
    ]);
    expect(AuthorsV2.find({exampleVersion:1, lang:'en'})).toEqual([
      AuthorsV2.authorInfo('sujato'),
    ]);
  });
  it("find() sutta", ()=>{
    expect(AuthorsV2.find({sutta:true, lang:'en'})).toEqual([
      // exampleVersion
      AuthorsV2.authorInfo('sujato'),

      // alphabetical
      //AuthorsV2.authorInfo('anandajoti'),
      //AuthorsV2.authorInfo('davis'),
      AuthorsV2.authorInfo('kelly'),
      AuthorsV2.authorInfo('kovilo'),
      //AuthorsV2.authorInfo('patton'),
      AuthorsV2.authorInfo('soma'),
      AuthorsV2.authorInfo('suddhaso'),
    ]);
  });
  it("find() vinaya", ()=>{
    let authors = AuthorsV2.find({vinaya:true});
    expect(authors[0]).toEqual(AuthorsV2.authorInfo('ms'));
    expect(authors[1]).toEqual(AuthorsV2.authorInfo('brahmali'));
    expect(authors[2]).toEqual(AuthorsV2.authorInfo('jayasaro', 'lo'));
    expect(authors[3]).toEqual(AuthorsV2.authorInfo('jayasaro', 'th'));
  });
  it("buildAuthorStats()", async ()=>{
    let stats = await AuthorsV2.buildAuthorStats();
    let sujato = stats['en:sujato'];
    expect(sujato.sutta).toBeGreaterThan(4000);
    expect(sujato.sutta).toBeLessThan(6000);
    expect(sujato['sutta/dn']).toBe(34);
    expect(sujato['sutta/an/an1']).toBeUndefined();

    let sabbamitta = stats['de:sabbamitta'];
    expect(sabbamitta.sutta).toBeGreaterThan(3900);
    expect(sabbamitta.sutta).toBeLessThan(6000);
    expect(sabbamitta['sutta/dn']).toBe(34);
  });
  it("buildAuthorStats() depth", async ()=>{
    let stats = await AuthorsV2.buildAuthorStats(99);
    let sujato = stats['en:sujato'];
    expect(sujato.sutta).toBeGreaterThan(4000);
    expect(sujato.sutta).toBeLessThan(6000);
    expect(sujato['sutta/dn']).toBe(34);
    expect(sujato['sutta/an/an1']).toBe(31);
    expect(sujato['sutta/kn/thig']).toBe(73);

    let sabbamitta = stats['de:sabbamitta'];
    expect(sabbamitta.sutta).toBeGreaterThan(3900);
    expect(sabbamitta.sutta).toBeLessThan(6000);
    expect(sabbamitta['sutta/dn']).toBe(34);
    expect(sabbamitta['sutta/an/an1']).toBe(31);
    expect(sabbamitta['sutta/kn/thig']).toBe(73);
  });
  it("suttaAuthor()", ()=>{
    // choose human quality over ebt-deepl quantity
    expect(AuthorsV2.suttaAuthor('an1.1-10/pt')).toBe('laera-quaresma');

    // choose available vs. desired translator
    expect(AuthorsV2.suttaAuthor('mil3.1.1/en/sujato')).toBe('kelly');
    expect(AuthorsV2.suttaAuthor('an5.22/pt/laera-quaresma'))
      .toBe('laera-quaresma');
    expect(AuthorsV2.suttaAuthor('an5.206/pt/ebt-deepl'))
      .toBe('laera-quaresma');
    expect(AuthorsV2.suttaAuthor('mn44/pt/laera-quaresma'))
      .toBe('laera-quaresma');

    // choose author with most translations overall when two
    // translatators have translated same things in translation folder
    expect(AuthorsV2.suttaAuthor('thig1.1/en')).toBe('sujato');
    expect(AuthorsV2.suttaAuthor('thig1.1/en/soma')).toBe('soma');
    expect(AuthorsV2.suttaAuthor('thig1.1/en/sujato')).toBe('sujato');
  });

});
