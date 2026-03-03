import { expect, describe, it } from "vitest";
import { Authors } from "../main.mjs";

describe("authors", () => {
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

    expect(Authors.authorInfo('ms')).toEqual(ms);
    expect(Authors.authorInfo('sujato')).toEqual(sujato);
    expect(Authors.authorInfo('sabbamitta')).toEqual(sabbamitta);
    expect(Authors.authorInfo('brahmali')).toEqual(brahmali);

    expect(Authors.authorInfo('sabbamitta')).toEqual(sabbamitta);
  });
  it("compare(a1,a2)", ()=>{
    let sujato = "sujato";
    let sabbamitta = "sabbamitta";
    let davis = "davis";
    let unknown = "unknown";

    // equal
    expect(Authors.compare()).toBe(0);
    expect(Authors.compare(unknown,unknown)).toBe(0);
    expect(Authors.compare(undefined,undefined)).toBe(0);
    expect(Authors.compare(null,null)).toBe(0);
    expect(Authors.compare(undefined,null)).toBe(0);
    expect(Authors.compare(null,unknown)).toBe(0);
    expect(Authors.compare(sujato,sujato)).toBe(0);
    expect(Authors.compare(davis,davis)).toBe(0);

    // ascending
    expect(Authors.compare(undefined,davis)).toBe(1);
    expect(Authors.compare(null,davis)).toBe(1);
    expect(Authors.compare(unknown,davis)).toBe(1);
    expect(Authors.compare(unknown,sujato)).toBe(1);
    expect(Authors.compare(sujato,davis)).toBe(1);
    expect(Authors.compare(sabbamitta, sujato)).toBe(1);

    // descending
    expect(Authors.compare(davis, sujato)).toBe(-1);
    expect(Authors.compare(davis, undefined)).toBe(-1);
    expect(Authors.compare(davis, null)).toBe(-1);
    expect(Authors.compare(davis, unknown)).toBe(-1);
    expect(Authors.compare(sujato, unknown)).toBe(-1);
    expect(Authors.compare(sujato,sabbamitta)).toBe(-1);
  });
  it("langAuthor", ()=>{
    expect(Authors.langAuthor('de')).toBe('sabbamitta');
    expect(Authors.langAuthor('en')).toBe('sujato');
    expect(Authors.langAuthor('jpn')).toBe('kaz');
    expect(Authors.langAuthor('pt')).toBeUndefined();
  });

});
