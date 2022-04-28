import { Authors } from "../main.mjs";
import should from "should";

typeof describe === "function" && describe("authors", function () {
  it("TESTTESTauthorInfo() => supported author info", async()=>{
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
        //lang: 'en',
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

});
