import should from "should";
import { SuttaRef } from "../main.mjs";

typeof describe === "function" &&
  describe("sutta-ref", function () {
    it("default ctor", () => {
      should.throws(() => new SuttaRef());
    });
    it("custom ctor", () => {
      let sutta_uid = "thig1.1";
      let lang = "tst-lang";
      let defaultLang = "default-lang";
      let author = "tst-author";
      let segnum = "0.1";
      let suttaRef = new SuttaRef({ sutta_uid, lang, author, segnum });
      should(suttaRef).properties({ sutta_uid, lang, author, segnum });

      let suttaRef2 = new SuttaRef(suttaRef);
      should(suttaRef2).properties({ sutta_uid, lang, author, segnum });
    });
    it("TESTTESTcreate(...) => SuttaRef", () => {
      let defaultLang = "default-lang";
      let author = "tst-author";
      let lang = "tst-lang";
      let sutta_uid = "thig1.1";
      let segnum = "0.1";

      // string sutta reference Pali
      should(
        SuttaRef.create(`${sutta_uid}/${lang}/${author}:${segnum}`)
      ).properties({ sutta_uid, lang, author, segnum });
      should(SuttaRef.create(`${sutta_uid}/${lang}/${author}`)).properties({
        sutta_uid,
        lang,
        author,
        segnum: undefined,
      });
      should(SuttaRef.create(`${sutta_uid}/${lang}`)).properties({
        sutta_uid,
        lang,
        author: undefined,
        segnum: undefined,
      });
      should(SuttaRef.create(`${sutta_uid}/${lang}:${segnum}`)).properties({
        sutta_uid,
        lang,
        author: undefined,
        segnum,
      });
      should(SuttaRef.create(`${sutta_uid}`)).properties({
        sutta_uid,
        lang: "pli",
        author: "ms",
        segnum: undefined,
      });
      should(SuttaRef.create(`${sutta_uid}:${segnum}`)).properties({
        sutta_uid,
        lang: "pli",
        author: "ms",
        segnum,
      });

      // string sutta reference defaultLang
      should(
        SuttaRef.create(`${sutta_uid}:${segnum}/${lang}/${author}`, defaultLang)
      ).properties({ sutta_uid, lang, author, segnum });
      should(
        SuttaRef.create(`${sutta_uid}/${lang}/${author}:${segnum}`, defaultLang)
      ).properties({ sutta_uid, lang, author, segnum });
      should(
        SuttaRef.create(`${sutta_uid}/${lang}/${author}`, defaultLang)
      ).properties({ sutta_uid, lang, author, segnum: undefined });
      should(SuttaRef.create(`${sutta_uid}/${lang}`, defaultLang)).properties({
        sutta_uid,
        lang,
        author: undefined,
        segnum: undefined,
      });
      should(
        SuttaRef.create(`${sutta_uid}:${segnum}/${lang}`, defaultLang)
      ).properties({ sutta_uid, lang, author: undefined, segnum });
      should(
        SuttaRef.create(`${sutta_uid}/${lang}:${segnum}`, defaultLang)
      ).properties({ sutta_uid, lang, author: undefined, segnum });
      should(SuttaRef.create(`${sutta_uid}`, defaultLang)).properties({
        sutta_uid,
        lang: defaultLang,
        author: undefined,
        segnum: undefined,
      });
      should(SuttaRef.create(`${sutta_uid}:${segnum}`, defaultLang)).properties(
        { sutta_uid, lang: defaultLang, author: undefined, segnum }
      );
    });
    it("create(object) => SuttaRef", () => {
      let defaultLang = "default-lang";
      let author = "tst-author";
      let lang = "tst-lang";
      let sutta_uid = "thig1.1";
      let segnum = "0.1";

      // string sutta reference defaultLang
      should(SuttaRef.create({ sutta_uid, lang, author, segnum })).properties({
        sutta_uid,
        lang,
        author,
        segnum,
      });
      should(SuttaRef.create({ sutta_uid, lang, author })).properties({
        sutta_uid,
        lang,
        author,
        segnum: undefined,
      });
      should(SuttaRef.createFromObject({ sutta_uid, lang })).properties({
        sutta_uid,
        lang,
        author: undefined,
        segnum: undefined,
      });
      should(SuttaRef.create({ sutta_uid, lang, segnum })).properties({
        sutta_uid,
        lang,
        author: undefined,
        segnum,
      });
      should(SuttaRef.create({ sutta_uid })).properties({
        sutta_uid,
        lang: "pli",
        author: "ms",
        segnum: undefined,
      });
      should(SuttaRef.create({ sutta_uid, segnum })).properties({
        sutta_uid,
        lang: "pli",
        author: "ms",
        segnum,
      });

      // object sutta reference defaultLang
      should(
        SuttaRef.create({ sutta_uid, lang, author, segnum }, defaultLang)
      ).properties({ sutta_uid, lang, author, segnum });
      should(
        SuttaRef.create({ sutta_uid, lang, author }, defaultLang)
      ).properties({ sutta_uid, lang, author, segnum: undefined });
      should(SuttaRef.create({ sutta_uid, lang }, defaultLang)).properties({
        sutta_uid,
        lang,
        author: undefined,
        segnum: undefined,
      });
      should(
        SuttaRef.create({ sutta_uid, lang, segnum }, defaultLang)
      ).properties({ sutta_uid, lang, author: undefined, segnum });
      should(SuttaRef.create({ sutta_uid }, defaultLang)).properties({
        sutta_uid,
        lang: defaultLang,
        author: undefined,
        segnum: undefined,
      });
      should(SuttaRef.create({ sutta_uid, segnum }, defaultLang)).properties({
        sutta_uid,
        lang: defaultLang,
        author: undefined,
        segnum,
      });

      // SuttaRef
      let suttaRef = new SuttaRef({ sutta_uid, lang, author, segnum });
      let suttaRef2 = SuttaRef.create(suttaRef, defaultLang);
      should(suttaRef2).not.equal(suttaRef);
      should(suttaRef2).properties({ sutta_uid, lang, author, segnum });
    });
    it("create(...) invalid SuttaRef", () => {
      should(SuttaRef.create('test-bad!!!')).equal(null);
      should(SuttaRef.create('thig1.1,en,abc')).equal(null);
    });
    it("create(object) translator => SuttaRef", () => {
      let defaultLang = "default-lang";
      let author = "tst-author";
      let lang = "tst-lang";
      let sutta_uid = "thig1.1";
      let segnum = "0.1";

      // object sutta reference translator
      let translator = "tst-translator";
      should(
        SuttaRef.create({ sutta_uid, lang, author, translator, segnum })
      ).properties({ sutta_uid, lang, author, segnum });
      should(
        SuttaRef.create({ sutta_uid, lang, author, translator })
      ).properties({ sutta_uid, lang, author, segnum: undefined });
      should(SuttaRef.create({ sutta_uid, lang, translator })).properties({
        sutta_uid,
        lang,
        author: translator,
        segnum: undefined,
      });
      should(
        SuttaRef.create({ sutta_uid, lang, translator, segnum })
      ).properties({ sutta_uid, lang, author: translator, segnum });
      should(SuttaRef.create({ sutta_uid, translator })).properties({
        sutta_uid,
        lang: "pli",
        author: translator,
        segnum: undefined,
      });
      should(SuttaRef.create({ sutta_uid, segnum, translator })).properties({
        sutta_uid,
        lang: "pli",
        author: translator,
        segnum,
      });
    });
    it("toString()", ()=>{
      let sutta_uid = 'thig1.1';
      let lang = 'de';
      let translator = 'sabbamitta';
      let segnum = '2.3';
      should(SuttaRef.create({sutta_uid, lang, translator}).toString())
        .equal("thig1.1/de/sabbamitta");
      should(SuttaRef.create({sutta_uid, lang, translator, segnum}).toString())
        .equal("thig1.1/de/sabbamitta:2.3");
      should(SuttaRef.create({sutta_uid:"thig1.1/de/sabbamitta:2.3"}).toString())
        .equal("thig1.1/de/sabbamitta:2.3");
      should(SuttaRef.create({sutta_uid:"thig1.1"}).toString())
        .equal("thig1.1/pli/ms");
    });
  });
