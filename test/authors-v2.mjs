import { AuthorsV2 } from "../main.mjs";
import should from "should";

typeof describe === "function" && describe("authors-v2", function () {
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
        exampleVersion: 0,
    };

    should.deepEqual(AuthorsV2.authorInfo('laera-quaresma'), gnlaera);
    should.deepEqual(AuthorsV2.authorInfo('kaz'), kaz);
    should.deepEqual(AuthorsV2.authorInfo('soma'), soma);
    should.deepEqual(AuthorsV2.authorInfo('ms'), ms);
    should.deepEqual(AuthorsV2.authorInfo('sujato'), sujato);
    should.deepEqual(AuthorsV2.authorInfo('sabbamitta'), sabbamitta);
    should.deepEqual(AuthorsV2.authorInfo('brahmali'), brahmali);

    should.deepEqual(AuthorsV2.authorInfo('sabbamitta'), sabbamitta);
  });
  it("compare(a1,a2)", ()=>{
    let sujato = "sujato";
    let sabbamitta = "sabbamitta";
    let davis = "davis";
    let unknown = "unknown";

    // equal
    should(AuthorsV2.compare()).equal(0);
    should(AuthorsV2.compare(unknown,unknown)).equal(0);
    should(AuthorsV2.compare(undefined,undefined)).equal(0);
    should(AuthorsV2.compare(null,null)).equal(0);
    should(AuthorsV2.compare(undefined,null)).equal(0);
    should(AuthorsV2.compare(null,unknown)).equal(0);
    should(AuthorsV2.compare(sujato,sujato)).equal(0);
    should(AuthorsV2.compare(davis,davis)).equal(0);

    // ascending
    should(AuthorsV2.compare(undefined,davis)).equal(-1);
    should(AuthorsV2.compare(null,davis)).equal(-1);
    should(AuthorsV2.compare(unknown,davis)).equal(1);
    should(AuthorsV2.compare(unknown,sujato)).equal(1);
    should(AuthorsV2.compare(sujato,davis)).equal(1);
    should(AuthorsV2.compare(sabbamitta, sujato)).equal(-1);

    // descending
    should(AuthorsV2.compare(davis, sujato)).equal(-1);
    should(AuthorsV2.compare(davis, undefined)).equal(1);
    should(AuthorsV2.compare(davis, null)).equal(1);
    should(AuthorsV2.compare(davis, unknown)).equal(-1);
    should(AuthorsV2.compare(sujato, unknown)).equal(-1);
    should(AuthorsV2.compare(sujato,sabbamitta)).equal(1);
  });
  it("langAuthor sutta", ()=>{
    let opts = { category: 'sutta'};

    should(AuthorsV2.langAuthor('unknown')).equal(undefined);
    should(AuthorsV2.langAuthor('de')).equal('sabbamitta');
    should(AuthorsV2.langAuthor('en')).equal('sujato');
    should(AuthorsV2.langAuthor('jpn')).equal('kaz');
    should(AuthorsV2.langAuthor('pt')).equal('laera-quaresma');

    should(AuthorsV2.langAuthor('unknown', opts)).equal(undefined);
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
  it("TESTTESTfind() lang", ()=>{
    should.deepEqual(AuthorsV2.find({lang:'pt'}), [
      AuthorsV2.authorInfo('laera-quaresma'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'jpn'}), [
      AuthorsV2.authorInfo('kaz'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'de'}), [
      AuthorsV2.authorInfo('sabbamitta'),
    ]);
    should.deepEqual(AuthorsV2.find({lang:'en'}), [
      AuthorsV2.authorInfo('sujato'),  // exampleVersion

      // alphabetical
      AuthorsV2.authorInfo('anandajoti'),
      AuthorsV2.authorInfo('brahmali'),
      AuthorsV2.authorInfo('davis'),
      AuthorsV2.authorInfo('kelly'),
      AuthorsV2.authorInfo('kovilo'),
      AuthorsV2.authorInfo('patton'),
      AuthorsV2.authorInfo('soma'),
      AuthorsV2.authorInfo('suddhaso'),
    ]);
  });
  it("TESTTESTfind() exampleVersion", ()=>{
    should.deepEqual(AuthorsV2.find({exampleVersion:1}), [
      AuthorsV2.authorInfo('ms'),
      AuthorsV2.authorInfo('kaz'),
      AuthorsV2.authorInfo('sabbamitta'),
      AuthorsV2.authorInfo('sujato'), 
    ]);
    should.deepEqual(AuthorsV2.find({exampleVersion:1, lang:'en'}), [
      AuthorsV2.authorInfo('sujato'), 
    ]);
  });
  it("TESTTESTfind() sutta", ()=>{
    should.deepEqual(AuthorsV2.find({sutta:true, lang:'en'}), [
      // exampleVersion
      AuthorsV2.authorInfo('sujato'),  

      // alphabetical
      AuthorsV2.authorInfo('anandajoti'),
      AuthorsV2.authorInfo('davis'),
      AuthorsV2.authorInfo('kelly'),
      AuthorsV2.authorInfo('kovilo'),
      AuthorsV2.authorInfo('patton'),
      AuthorsV2.authorInfo('soma'),
      AuthorsV2.authorInfo('suddhaso'),
    ]);
  });
  it("TESTTESTfind() vinaya", ()=>{
    should.deepEqual(AuthorsV2.find({vinaya:true}), [
      AuthorsV2.authorInfo('ms'),
      AuthorsV2.authorInfo('brahmali'),
    ]);
  });

});
