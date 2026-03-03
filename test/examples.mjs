import { expect, describe, it, beforeAll } from "vitest";
import { Examples } from "../main.mjs";
import { logger } from "log-instance/index.mjs";

logger.logLevel = 'warn';

describe("examples", () => {
    beforeAll(async function() {
      let msStart = Date.now();

      // pre-optimize by running TWICE!
      for (let i = 0; i < 2; i++) {
        expect(Examples.test('warm up test', 'en')).toBe(false);
        expect(Examples.test('warm up test', 'de')).toBe(false);
      }

      let msElapsed = Date.now() - msStart;
      console.log(`NOTE: beforeAll() pre-optimization takes ${msElapsed}ms`);
    });
    it("en", ()=>{
      let { en } = Examples;
      expect(en.indexOf('root of suffering')).toBeGreaterThan(0);
      expect(en.indexOf('not an example')).toBeLessThan(0);
    });
    it("de", ()=>{
      let { de } = Examples;
      expect(de.indexOf('Wurzel des Leidens')).toBeGreaterThan(0);
      expect(de.indexOf('not an example')).toBeLessThan(0);
    });
    it("authors", ()=>{
      let { authors } = Examples;
      let sujato = authors.find(v=>v.author === 'sujato');
      expect(sujato).toMatchObject({
        lang: 'en',
        category: 'sutta',
        version: '1',
        author: 'sujato',
      });
    });
    it("isExample", ()=>{
      // examples return example language
      expect(Examples.isExample("wilde[sn] Fohlen")).toBe('de');
      expect(Examples.isExample("but ma'am")).toBe('en');
      expect(Examples.isExample("but ma.am")).toBe('en');
      expect(Examples.isExample('root of suffering')).toBe('en');
      expect(Examples.isExample('Wurzel des Leidens')).toBe('de');
      expect(Examples.isExample('wurzel des leidens')).toBe('de');
      expect(Examples.isExample('Wurzel des Leidens', 'de')).toBe('de');

      // Non-examples return undefined
      expect(Examples.isExample("ma.am")).toBeUndefined();
      expect(Examples.isExample('what is root of suffering')).toBeUndefined();
      expect(Examples.isExample('Wurzel des Leidens', 'en')).toBeUndefined();
      expect(Examples.isExample('Wurzel des Leidens', 'no-lang')).toBeUndefined();
      expect(Examples.isExample('not an example')).toBeUndefined();
    });
    it("test() no examples", ()=>{
      let noMatch = 'no match text';

      expect(Examples.test('root of suffering', 'nolang')).toBe(false);
    });
    it("test()", ()=>{
      let enText = 'brown Root of Suffering fox';
      let deText = 'braune Wurzel des Leidens ist ein Fuchs';
      let noMatch = 'no match text';

      let msStart = Date.now();

      // test() is stateless, but global RegExp's are stateful
      expect(Examples.test('root of suffering')).toBe(true);
      expect(Examples.test('root of suffering')).toBe(true);

      expect(Examples.test(enText)).toBe(true);
      expect(Examples.test('wurzel des leidens', 'en')).toBe(false);
      expect(Examples.test('wurzel des leidens', 'de')).toBe(true);

      //console.log("test() msElapsed", Date.now() - msStart);
      let msElapsed = Date.now() - msStart;
      expect(msElapsed).toBeLessThan(10);
    });
    it("replaceAll()", ()=>{
      let text = 'A root of suffering B Root of Suffering C ANXIETY D';
      let template = '($&)';

      let msStart = Date.now();
      expect(Examples.replaceAll(text, template))
        .toBe('A (root of suffering) B (Root of Suffering) C (ANXIETY) D');
      let msElapsed = Date.now() - msStart;
      expect(msElapsed).toBeLessThan(10);

      expect(Examples.replaceAll(text, template, 'en'))
        .toBe('A (root of suffering) B (Root of Suffering) C (ANXIETY) D');
      expect(Examples.replaceAll(text, template, 'de'))
        .toBe('A root of suffering B Root of Suffering C ANXIETY D');
      expect(Examples.replaceAll(text, template, 'no-lang'))
        .toBe('A root of suffering B Root of Suffering C ANXIETY D');
    });
  });
