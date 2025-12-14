import { Authors, AuthorsV2 } from "../main.mjs";
import should from "should";

describe("authors-v2", function () {
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

    should(AuthorsV2.authorInfo('soma', 'it')).properties(soma);
    should(AuthorsV2.authorInfo('noeismet')).properties(noeismet);
    should(AuthorsV2.authorInfo('laera-quaresma')).properties(gnlaera);
    should(AuthorsV2.authorInfo('kaz')).properties(kaz);
    should(AuthorsV2.authorInfo('soma')).properties(soma);
    should(AuthorsV2.authorInfo('ms')).properties(ms);
    should(AuthorsV2.authorInfo('sujato')).properties(sujato);
    should(AuthorsV2.authorInfo('sabbamitta')).properties(sabbamitta);
    should(AuthorsV2.authorInfo('brahmali')).properties(brahmali);

    should(AuthorsV2.authorInfo('sabbamitta')).properties(sabbamitta);
  });
  it("authorInfo() v1 vs. v2", ()=>{
    let info1 = Authors.authorInfo('sujato');
    let info2 = AuthorsV2.authorInfo('sujato');

    should(info1.author).equal(info2.author);
    should(info1.lang).equal(info2.lang);
    should(info1.exampleVersion).equal(info2.exampleVersion);

    // Everything else is different
    should(info1.category).not.equal(info2.category);
    should(info1.name).not.equal(info2.name);
    should(info1.sutta).not.equal(info2.sutta);
    should(info1.vinaya).not.equal(info2.vinaya);
    should(info1.examples).not.equal(info2.examples);
    should(info1.type).not.equal(info2.type);
  });
  it("compare(a1,a2)", ()=>{
    let sujato = "sujato";
    let sabbamitta = "sabbamitta";
    let soma = "soma";
    let unknown = "unknown";
    let laera = "laera-quaresma";
    let ebtdeepl = "ebt-deepl";

    // equal
    should(AuthorsV2.compare()).equal(0);
    should(AuthorsV2.compare(unknown,unknown)).equal(0);
    should(AuthorsV2.compare(undefined,undefined)).equal(0);
    should(AuthorsV2.compare(null,null)).equal(0);
    should(AuthorsV2.compare(undefined,null)).equal(0);
    should(AuthorsV2.compare(null,unknown)).equal(0);
    should(AuthorsV2.compare(sujato,sujato)).equal(0);
    should(AuthorsV2.compare(soma,soma)).equal(0);

    // ascending
    should(AuthorsV2.compare(undefined,soma)).equal(-1);
    should(AuthorsV2.compare(null,soma)).equal(-1);
    should(AuthorsV2.compare(unknown,soma)).equal(1);
    should(AuthorsV2.compare(unknown,sujato)).equal(1);
    should(AuthorsV2.compare(sujato,soma)).equal(1);
    should(AuthorsV2.compare(laera, ebtdeepl)).equal(1);
    should(AuthorsV2.compare(sabbamitta, sujato)).equal(-1);

    // descending
    should(AuthorsV2.compare(soma, sujato)).equal(-1);
    should(AuthorsV2.compare(ebtdeepl, laera)).equal(-1);
    should(AuthorsV2.compare(soma, undefined)).equal(1);
    should(AuthorsV2.compare(soma, null)).equal(1);
    should(AuthorsV2.compare(soma, unknown)).equal(-1);
    should(AuthorsV2.compare(sujato, unknown)).equal(-1);
    should(AuthorsV2.compare(sujato,sabbamitta)).equal(1);
  });
  it("TESTTESTlangAuthor sutta", ()=>{
    let opts = { category: 'sutta'};

    should(AuthorsV2.langAuthor('ru')).equal('sv');
    should(AuthorsV2.langAuthor('es')).equal('maggatr');
    should(AuthorsV2.langAuthor('unknown')).equal(undefined);
    should(AuthorsV2.langAuthor('fr')).equal('noeismet');
    should(AuthorsV2.langAuthor('de')).equal('sabbamitta');
    should(AuthorsV2.langAuthor('en')).equal('sujato');
    should(AuthorsV2.langAuthor('jpn')).equal('kaz');
    should(AuthorsV2.langAuthor('pt')).equal('laera-quaresma');

    should(AuthorsV2.langAuthor('unknown', opts)).equal(undefined);
    should(AuthorsV2.langAuthor('ru', opts)).equal('sv');
    should(AuthorsV2.langAuthor('fr', opts)).equal('noeismet');
    should(AuthorsV2.langAuthor('de', opts)).equal('sabbamitta');
    should(AuthorsV2.langAuthor('en', opts)).equal('sujato');
    should(AuthorsV2.langAuthor('jpn', opts)).equal('kaz');
    should(AuthorsV2.langAuthor('pt', opts)).equal('laera-quaresma');
  });
  it("langAuthor vinaya", ()=>{
    let opts = { category: 'vinaya'};

    should(AuthorsV2.langAuthor('unknown')).equal(undefined);
    should(AuthorsV2.langAuthor('de')).equal('sabbamitta');
    should(AuthorsV2.langAuthor('en')).equal('sujato');
    should(AuthorsV2.langAuthor('jpn')).equal('kaz');
    should(AuthorsV2.langAuthor('pt')).equal('laera-quaresma');

    should(AuthorsV2.langAuthor('unknown', opts)).equal(undefined);
    should(AuthorsV2.langAuthor('de', opts)).equal(undefined);
    should(AuthorsV2.langAuthor('en', opts)).equal('brahmali');
    should(AuthorsV2.langAuthor('jpn', opts)).equal(undefined);
    should(AuthorsV2.langAuthor('pt', opts)).equal(undefined);
  });
  it("find() lang", ()=>{
    should.deepEqual(AuthorsV2.find({lang:'es'}), [
      //AuthorsV2.authorInfo('ebt-deepl', 'es'),
      AuthorsV2.authorInfo('font'),
      AuthorsV2.authorInfo('maggatr'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'pt'}), [
      AuthorsV2.authorInfo('laera-quaresma'),
      //AuthorsV2.authorInfo('ebt-deepl', 'pt'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'ru'}), [
      AuthorsV2.authorInfo('narinyanievmenenko'),
      AuthorsV2.authorInfo('sv'),
      AuthorsV2.authorInfo('syrkin'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'jpn'}), [
      AuthorsV2.authorInfo('kaz'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'de'}), [
      AuthorsV2.authorInfo('sabbamitta'),
      AuthorsV2.authorInfo('sonjabuege'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'en', }), [
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
    should.deepEqual(
      AuthorsV2.find({lang:'en', sutta:true, vinaya:false}), [
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
    should.deepEqual(authors, [
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
    should.deepEqual(AuthorsV2.find({exampleVersion:1, lang:'en'}), [
      AuthorsV2.authorInfo('sujato'), 
    ]);
  });
  it("find() sutta", ()=>{
    should.deepEqual(AuthorsV2.find({sutta:true, lang:'en'}), [
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
    should.deepEqual(authors[0], AuthorsV2.authorInfo('ms'));
    should.deepEqual(authors[1], AuthorsV2.authorInfo('brahmali'));
    should.deepEqual(authors[2], AuthorsV2.authorInfo('jayasaro', 'lo'));
    should.deepEqual(authors[3], AuthorsV2.authorInfo('jayasaro', 'th'));
  });
  it("buildAuthorStats()", async ()=>{
    let stats = await AuthorsV2.buildAuthorStats();
    let sujato = stats['en:sujato'];
    should(sujato.sutta).above(4000).below(6000);
    should(sujato['sutta/dn']).equal(34);
    should(sujato['sutta/an/an1']).equal(undefined);

    let sabbamitta = stats['de:sabbamitta'];
    should(sabbamitta.sutta).above(3900).below(6000);
    should(sabbamitta['sutta/dn']).equal(34);
  });
  it("buildAuthorStats() depth", async ()=>{
    let stats = await AuthorsV2.buildAuthorStats(99);
    let sujato = stats['en:sujato'];
    should(sujato.sutta).above(4000).below(6000);
    should(sujato['sutta/dn']).equal(34);
    should(sujato['sutta/an/an1']).equal(31);
    should(sujato['sutta/kn/thig']).equal(73);

    let sabbamitta = stats['de:sabbamitta'];
    should(sabbamitta.sutta).above(3900).below(6000);
    should(sabbamitta['sutta/dn']).equal(34);
    should(sabbamitta['sutta/an/an1']).equal(31);
    should(sabbamitta['sutta/kn/thig']).equal(73);
  });
  it("suttaAuthor()", ()=>{
    // choose human quality over ebt-deepl quantity
    should(AuthorsV2.suttaAuthor('an1.1-10/pt')).equal('laera-quaresma');

    // choose available vs. desired translator
    should(AuthorsV2.suttaAuthor('mil3.1.1/en/sujato')).equal('kelly');
    should(AuthorsV2.suttaAuthor('an5.22/pt/laera-quaresma'))
      .equal('laera-quaresma');
    should(AuthorsV2.suttaAuthor('an5.206/pt/ebt-deepl'))
      .equal('laera-quaresma');
    should(AuthorsV2.suttaAuthor('mn44/pt/laera-quaresma'))
      .equal('laera-quaresma');

    // choose author with most translations overall when two 
    // translatators have translated same things in translation folder
    should(AuthorsV2.suttaAuthor('thig1.1/en')).equal('sujato');
    should(AuthorsV2.suttaAuthor('thig1.1/en/soma')).equal('soma');
    should(AuthorsV2.suttaAuthor('thig1.1/en/sujato')).equal('sujato');
  });

});
