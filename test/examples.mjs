import { Examples } from "../main.mjs";
import { logger } from "log-instance";
import should from "should";

logger.logLevel = 'warn';

typeof describe === "function" &&
  describe("examples", function () {
    before(()=>{
      let msStart = Date.now();

      // pre-optimize by running TWICE!
      for (let i = 0; i < 2; i++) {
        should(Examples.test('warm up test', 'en')).equal(false);
        should(Examples.test('warm up test', 'de')).equal(false);
      }

      let msElapsed = Date.now() - msStart;
      console.log(`NOTE: before() pre-optimization takes ${msElapsed}ms`);
    });
    it("en", ()=>{
      let { en } = Examples;
      should(en.indexOf('root of suffering')).above(0);
      should(en.indexOf('not an example')).below(0);
    });
    it("de", ()=>{
      let { de } = Examples;
      should(de.indexOf('Wurzel des Leidens')).above(0);
      should(de.indexOf('not an example')).below(0);
    });
    it("authors", ()=>{
      let { authors } = Examples;
      let sujato = authors.find(v=>v.author === 'sujato');
      should(sujato).properties({
        lang: 'en',
        category: 'sutta',
        version: '1',
        author: 'sujato',
      });
    });
    it("TESTTESTisExample", ()=>{
      should(Examples.isExample("wilde[sn] Fohlen")).equal('de');
      should(Examples.isExample("but ma'am")).equal('en');
      should(Examples.isExample("but ma.am")).equal('en');
      should(Examples.isExample("ma.am")).equal(undefined);
      should(Examples.isExample('root of suffering')).equal('en');
      should(Examples.isExample('what is root of suffering')).equal(undefined);
      should(Examples.isExample('Wurzel des Leidens')).equal('de');
      should(Examples.isExample('wurzel des leidens')).equal('de');
      should(Examples.isExample('Wurzel des Leidens', 'en')).equal(undefined);
      should(Examples.isExample('Wurzel des Leidens', 'de')).equal('de');
      should(Examples.isExample('not an example')).equal(undefined);
    });
    it("TESTTESTtest()", ()=>{
      let enText = 'brown Root of Suffering fox';
      let deText = 'braune Wurzel des Leidens ist ein Fuchs';
      let noMatch = 'no match text';

      let msStart = Date.now();

      // test() is stateless, but global RegExp's are stateful
      should(Examples.test('root of suffering')).equal(true);
      should(Examples.test('root of suffering')).equal(true); 

      should(Examples.test(enText)).equal(true); 
      should(Examples.test('wurzel des leidens', 'en')).equal(false);
      should(Examples.test('wurzel des leidens', 'de')).equal(true);

      //console.log("test() msElapsed", Date.now() - msStart);
      let msElapsed = Date.now() - msStart;
      should(msElapsed).below(10);
    });
    it("TESTTESTreplaceAll()", ()=>{
      let msStart = Date.now();
      let text = 'A root of suffering B Root of Suffering C ANXIETY D';
      let template = '($&)';
      should(Examples.replaceAll(text, template))
        .equal('A (root of suffering) B (Root of Suffering) C (ANXIETY) D');
      let msElapsed = Date.now() - msStart;
      should(msElapsed).below(10);
    });
  });
