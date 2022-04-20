import { Examples } from "../main.mjs";
import should from "should";

typeof describe === "function" &&
  describe("examples", function () {
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
  });
