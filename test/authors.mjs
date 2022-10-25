import { Authors } from "../main.mjs";
import should from "should";

typeof describe === "function" && describe("authors", function () {
  it("authorInfo() => supported author info", async()=>{
    var ms = {
        lang: 'pli',
        type: "root",
        author: 'ms',
        name: "Mahāsaṅgīti Tipiṭaka Buddhavasse 2500",
        category: ["sutta", "vinaya"],
        exampleVersion: 999999,
    };
    var sujato = {
        lang: 'en',
        type: "translator",
        name: "Bhikkhu Sujato",
        category: ["sutta"],
        author: 'sujato',
        exampleVersion: 1,
    };
    var brahmali = {
        lang: 'en',
        type: "translator",
        author: "brahmali",
        //category: ["vinaya"],
        name: "Bhikkhu Brahmali",
        exampleVersion: 0,
    };
    var sabbamitta = {
        lang: 'de',
        type: "translator",
        name: "Sabbamitta",
        author: "sabbamitta",
        category: ["sutta"],
        exampleVersion: 1,
    };

    should.deepEqual(Authors.authorInfo('ms'), ms);
    should.deepEqual(Authors.authorInfo('sujato'), sujato);
    should.deepEqual(Authors.authorInfo('sabbamitta'), sabbamitta);
    should.deepEqual(Authors.authorInfo('brahmali'), brahmali);

    should.deepEqual(Authors.authorInfo('sabbamitta'), sabbamitta);
  });
  it("TESTTESTcompare(a1,a2)", ()=>{
    let sujato = "sujato";
    let sabbamitta = "sabbamitta";
    let davis = "davis";
    let unknown = "unknown";

    // equal
    should(Authors.compare()).equal(0);
    should(Authors.compare(unknown,unknown)).equal(0);
    should(Authors.compare(undefined,undefined)).equal(0);
    should(Authors.compare(null,null)).equal(0);
    should(Authors.compare(undefined,null)).equal(0);
    should(Authors.compare(null,unknown)).equal(0);
    should(Authors.compare(sujato,sujato)).equal(0);
    should(Authors.compare(davis,davis)).equal(0);

    // ascending
    should(Authors.compare(undefined,davis)).equal(1);
    should(Authors.compare(null,davis)).equal(1);
    should(Authors.compare(unknown,davis)).equal(1);
    should(Authors.compare(unknown,sujato)).equal(1);
    should(Authors.compare(sujato,davis)).equal(1);
    should(Authors.compare(sabbamitta, sujato)).equal(1);

    // descending
    should(Authors.compare(davis, sujato)).equal(-1);
    should(Authors.compare(davis, undefined)).equal(-1);
    should(Authors.compare(davis, null)).equal(-1);
    should(Authors.compare(davis, unknown)).equal(-1);
    should(Authors.compare(sujato, unknown)).equal(-1);
    should(Authors.compare(sujato,sabbamitta)).equal(-1);
  });
  it("TESTTESTlangAuthor", ()=>{
    should(Authors.langAuthor('de')).equal('sabbamitta');
    should(Authors.langAuthor('en')).equal('sujato');
    should(Authors.langAuthor('jpn')).equal('kaz');
    should(Authors.langAuthor('pt')).equal(undefined);
  });

});
