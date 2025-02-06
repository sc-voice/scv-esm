import should from "should";
import { SuttaRef } from "../main.mjs";
import { logger } from "log-instance/index.mjs";
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
  it("create(...) jpn", () => {
    let sutta_uid = 'an1.31-40';
    let lang = 'jpn';
    let author = 'kaz';
    should(SuttaRef.create(sutta_uid, lang))
      .properties({sutta_uid, lang, author:undefined});
    should(SuttaRef.create(`${sutta_uid}/${lang}/${author}`))
      .properties({sutta_uid, lang, author});
  });
  it("create(...) => SuttaRef", () => {
    let defaultLang = "default-lang";
    let author = "tst-author";
    let lang = "tst-lang";
    let sutta_uid = "thig1.1";
    let segnum = "0.1";

    // string sutta reference Pali
    should(
      SuttaRef.create(`${sutta_uid}/${lang}/${author}:${segnum}`)
    ).properties({ sutta_uid, lang, author, segnum });
    should(SuttaRef.create(`${sutta_uid}/${lang}/${author}`))
    .properties({
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
    should(SuttaRef.create(`${sutta_uid}/${lang}:${segnum}`))
    .properties({
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
      SuttaRef.create(`${sutta_uid}:${segnum}/${lang}/${author}`, 
        defaultLang)
    ).properties({ sutta_uid, lang, author, segnum });
    should(
      SuttaRef.create(`${sutta_uid}/${lang}/${author}:${segnum}`, 
        defaultLang)
    ).properties({ sutta_uid, lang, author, segnum });
    should(
      SuttaRef.create(`${sutta_uid}/${lang}/${author}`, defaultLang)
    ).properties({ sutta_uid, lang, author, segnum: undefined });
    should(
      SuttaRef.create(`${sutta_uid}/${lang}`, defaultLang)
    ).properties({
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
    should(
      SuttaRef.create(`${sutta_uid}:${segnum}`, defaultLang)
    ).properties({ 
      sutta_uid, lang: defaultLang, author: undefined, segnum 
    });
  });
  it("create(object) an1.1 in an1.1-10=> SuttaRef", () => {
    let defaultLang = "en";
    let author = "sujato";
    let lang = "en";
    let sutta_uid = "an1.1";
    let segnum = "1.1";
    let scid = `${sutta_uid}:${segnum}`;
    let sref = SuttaRef.create(`${scid}/${lang}/${author}`);
    should(sref).properties({ sutta_uid: 'an1.1-10', lang, author, segnum, scid });
    let sref2 = SuttaRef.create(sref);
    should(sref2).properties({ sutta_uid: 'an1.1-10', lang, author, segnum, scid});
  });
  it("create(object) an1.2 in an1.1-10=> SuttaRef", () => {
    let defaultLang = "en";
    let author = "sujato";
    let lang = "en";
    let sutta_uid = "an1.2";
    let segnum = "1.1";
    let scid = `${sutta_uid}:${segnum}`;
    let sref = SuttaRef.create(`${scid}/${lang}/${author}`);
    should(sref).properties({ sutta_uid: 'an1.1-10', lang, author, segnum, scid });
    let sref2 = SuttaRef.create(sref);
    should(sref2).properties({ sutta_uid: 'an1.1-10', lang, author, segnum, scid});
  });
  it("create(object) sutta in range=> SuttaRef", () => {
    let defaultLang = "en";
    let author = "sujato";
    let lang = "en";
    let sutta_uid = "an1.11";
    let segnum = undefined;
    let sref = SuttaRef.create({ sutta_uid, lang, author, segnum });
    should(sref).properties({ sutta_uid: 'an1.11-20', lang, author, segnum, });
    let sref2 = SuttaRef.create(sref);
    should(sref2).properties({ sutta_uid: 'an1.11-20', lang, author, segnum, });
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
  it("create(mlDoc) => SuttaRef", () => {
    let defaultLang = "default-lang";
    let author_uid = "tst-author";
    let author = author_uid;
    let lang = "tst-lang";
    let sutta_uid = "thig1.1";
    let segments = [];
    let mlDoc = { sutta_uid, lang, author_uid, segments };

    // string sutta reference defaultLang
    should(SuttaRef.create(mlDoc)).properties({
      sutta_uid,
      lang,
      author,
    });
    should(SuttaRef.segnum).equal(undefined);
  });
  it("create(...) invalid SuttaRef", () => {
    let logLevel = logger.logLevel;
    logger.logLevel = 'error';
    should(SuttaRef.create('xyz')).equal(null);
    should(SuttaRef.create('aaa')).equal(null);
    should(SuttaRef.create('test-bad!!!')).equal(null);
    should(SuttaRef.create('thig1.1,en,abc')).equal(null);
    logger.logLevel = logLevel;
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
    let test = (o,lang)=>SuttaRef.create(o,lang).toString();

    // Object
    should(test({sutta_uid, lang, translator}))
      .equal("thig1.1/de/sabbamitta");
    should(test({sutta_uid, lang, translator, segnum}))
      .equal("thig1.1:2.3/de/sabbamitta");
    should(test({sutta_uid:"thig1.1:2.3/de/sabbamitta"}))
      .equal("thig1.1:2.3/de/sabbamitta");
    should(test({sutta_uid:"thig1.1"})).equal("thig1.1/pli/ms");

    // String
    should(test("thig1.1/en/soma")).equal("thig1.1/en/soma");
    should(test("thig1.1")).equal("thig1.1/pli/ms");
    should(test("thig1.1:2.3")).equal("thig1.1:2.3/pli/ms");
    should(test("thig1.1", 'de')).equal("thig1.1/de");
    should(test("thig1.1:2.3", 'de')).equal("thig1.1:2.3/de");
    should(test("thig1.1:2.3/de")).equal("thig1.1:2.3/de");
    should(test("thig1.1:2.3/de/sabbamitta"))
      .equal("thig1.1:2.3/de/sabbamitta");
    should(test("thig1.1", 'en')).equal("thig1.1/en");
    should(test("thig1.1:2.3", 'en')).equal("thig1.1:2.3/en");
  });
  it("create() thig11", ()=>{ 
    let sutta_uid = 'thig11';
    let lang = 'en';
    let translator = 'soma';
    let segnum = '2.3';
    let eCaught;
    let res;
    let level = logger.logLevel;
    logger.logLevel = 'error'; // ignore WARN
    try {
      res = SuttaRef.create({sutta_uid, lang, translator});
    } catch(e) {
      eCaught = e;
    }
    logger.logLevel = level;
    should(res).equal(null);
    should(eCaught).equal(undefined);
  });
  it("createWithError() thig11", ()=>{ 
    let sutta_uid = 'thig11';
    let lang = 'en';
    let translator = 'soma';
    let segnum = '2.3';
    let test = (o,lang)=>SuttaRef.create(o,lang).toString();
    let eCaught;
    let res;
    try {
      let res = SuttaRef.createWithError({sutta_uid, lang, translator});
    } catch(e) {
      eCaught = e;
    }
    should(res).equal(undefined);
    should(eCaught.message).match(/(thig11?)/);
  });
  it("create() creates copy", ()=>{
    let sref1 = SuttaRef.create("thig1.1");
    let sref2 = SuttaRef.create(sref1);

    should.deepEqual(sref1, sref2);
    should(sref1 === sref2).equal(false);
    should(sref1).not.equal(sref2);
  });
  it("createOpts() creates copy", ()=>{
    let sref1 = SuttaRef.createOpts("thig1.1");
    let sref2 = SuttaRef.createOpts(sref1);

    should.deepEqual(sref1, sref2);
    should(sref1 === sref2).equal(false);
    should(sref1).not.equal(sref2);
  });
  it("createOpts() existing parameters", ()=>{
    const suids = {
      filter: ()=>['thig1.1-10'],
    };
    const defaultLang = 'de';

    // existing parameters
    should.deepEqual(SuttaRef.createOpts('an1.31-40/jpn/kaz'),
      SuttaRef.create('an1.31-40/jpn/kaz'));
    should.deepEqual(SuttaRef.createOpts('an1.31-40/jpn'),
      SuttaRef.create('an1.31-40/jpn'));
    console.log("BEGIN EXPECTED WARNING");
    should.deepEqual(SuttaRef.createOpts('yzx'),
      SuttaRef.create('yzx'));
    console.log("END EXPECTED WARNING");
    should.deepEqual(SuttaRef.createOpts(undefined),
      SuttaRef.create(undefined));
    should.deepEqual(SuttaRef.createOpts('thig1.1/en/soma'),
      SuttaRef.create('thig1.1/en/soma'));
    should.deepEqual(SuttaRef.createOpts('thig1.1', {defaultLang}),
      SuttaRef.create('thig1.1', 'de'));
    should.deepEqual(
      SuttaRef.createOpts('thig1.1', {defaultLang, suids}),
      SuttaRef.create('thig1.1', 'de', suids));
    should.deepEqual(
      SuttaRef.createOpts('thig1.1', {suids}),
      SuttaRef.create('thig1.1', undefined, suids));
  });
  it("createOpts() new parameters", ()=>{
    const suids = {
      filter: ()=>['thig1.1-10'],
    };
    const normalize = true;

    should.deepEqual(SuttaRef.createOpts('an1.31-40/jpn', {normalize}),
      SuttaRef.create('an1.31-40/jpn/kaz'));
    console.log("BEGIN EXPECTED WARNING");
    should.deepEqual(SuttaRef.createOpts('xyz', {normalize}),
      SuttaRef.create('xyz'));
    console.log("END EXPECTED WARNING");
    should.deepEqual(SuttaRef.createOpts('mil3.1.1/en', {normalize}),
      SuttaRef.create('mil3.1.1/en/kelly'));
  });
  it("createFromString() an1.175-186:1.1", ()=>{
    // an1.175-186:1.1 is a segment in an1.170-187
    let segnum = '1.1';
    let sutta_uid = 'an1.170-187';
    let scid = `an1.175-186:${segnum}`;
    let sref = SuttaRef.createFromString(scid);
    should(sref).properties({ 
      sutta_uid, 
      lang: 'pli', 
      author: 'ms', 
      segnum, 
      scid 
    });
  });
  it("createFromString() an1.102-109:1.1/pt/ebt-deepl", ()=>{
    let scid = 'an1.102-109:1.1/pt/ebt-deepl';
    should(SuttaRef.createFromString(scid)).properties({
      sutta_uid: 'an1.98-139',
      segnum: '1.1',
      lang: 'pt',
      author: 'ebt-deepl',
    });
  });
  it("exists",()=>{
    let mn1 = SuttaRef.create('mn1/en/soma');
    should(mn1.exists()).equal(false);

    // EN
    should(SuttaRef.create('thig1.1/en').exists()).equal(true);
    should(SuttaRef.create('thig1.1/en/sujato').exists()).equal(true);
    should(SuttaRef.create('thig1.1/en/soma').exists()).equal(true);
    should(SuttaRef.create('mn1/en/soma').exists()).equal(false);

    // DE
    should(SuttaRef.create('thig1.1/de').exists()).equal(true);
    should(
      SuttaRef.create('thig1.1/de/sabbamitta').exists()
    ).equal(true);
    should(SuttaRef.create('thig1.1/de/sujato').exists()).equal(false);

    // Pali
    should(SuttaRef.create('tha-ap34').exists()).equal(true);
    should(SuttaRef.create('thig1.1').exists()).equal(true);
    should(SuttaRef.create('thig1.1/pli').exists()).equal(true);
    should(SuttaRef.create('thig1.1/pli/ms').exists()).equal(true);
    should(SuttaRef.create('thig1.1/pli/sujato').exists()).equal(false);
  });
  it("TESTTESTcreateOpts() mn8/fr", ()=>{
    const msg = 'ts6f.createOpts-mn8-fr';
    const normalize = true;
    const lang = 'fr';

    let mn_fr = SuttaRef.createOpts('mn8/fr', 
      {normalize, defaultLang:lang});
    should(mn_fr.sutta_uid).equal('mn8');
    should(mn_fr.lang).equal('fr');
    should(mn_fr.author).equal('noeismet');
    should(mn_fr.segnum).equal(undefined);
    should(mn_fr.scid).equal('mn8');
  });
});
