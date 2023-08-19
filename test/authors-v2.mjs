import { AuthorsV2 } from "../main.mjs";
import should from "should";

typeof describe === "function" && describe("authors-v2", function () {
  it("TESTTESTauthorInfo() => supported author info", async()=>{
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
  it("langAuthor", ()=>{
    should(AuthorsV2.langAuthor('de')).equal('sabbamitta');
    should(AuthorsV2.langAuthor('en')).equal('sujato');
    should(AuthorsV2.langAuthor('jpn')).equal('kaz');
    should(AuthorsV2.langAuthor('pt')).equal('laera-quaresma');
  });

});
