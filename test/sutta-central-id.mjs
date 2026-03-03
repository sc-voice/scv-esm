import { expect, describe, it, beforeEach } from "vitest";
import { SuttaCentralId } from "../main.mjs";
import { DBG } from '../src/defines.mjs';

describe("sutta-central-id", () => {
    const logLevel = false;

    const assertLess = (cmp, a, b) => {
      expect(cmp(a, b)).toBeLessThan(0);
      expect(cmp(b, a)).toBeGreaterThan(0);
    };
    const assertEqual = (cmp, a, b) => {
      expect(cmp(a, b)).toBe(0);
      expect(cmp(b, a)).toBe(0);
    };
    function testCompareLow(a, b, expected) {
      expect(SuttaCentralId.compareLow(a, b)).toBe(expected);
      if (expected === 0) {
        expect(SuttaCentralId.compareLow(b, a)).toBe(expected);
      } else {
        expect(SuttaCentralId.compareLow(b, a)).toBe(-expected);
      }
    }

    var en_suj = `translation/en/sujato/sutta/`;

    it("default ctor", function () {
      expect(() => {
        var scid = new SuttaCentralId();
      }).toThrow();
    });
    it("match(scid, pat)", ()=>{
      let scid11 = "thig1.1:1.1";
      let scid12 = "thig1.1:1.2";
      let scid21 = "thig1.2:1.1";
      let scid22 = "thig1.2:1.2";
      let scids = [scid11, scid12, scid21, scid22 ];
      let match = SuttaCentralId.match;
      
      expect(scids.map(scid=>match(scid, "thig 1.1-2")))
        .toEqual([true, true, true, true]);
      expect(scids.map(scid=>match(scid, "thig1.1-2")))
        .toEqual([true, true, true, true]);
      expect(scids.map(scid=>match(scid,
        "thig1.1:1.2/en/soma,thig1.2:1.1/en/soma")))
        .toEqual([false, true, true, false]);
      expect(scids.map(scid=>match(scid, "thig1.1:1.2/en/soma")))
        .toEqual([false, true, false, false]);
      expect(scids.map(scid=>match(scid, "thig1.1/en/soma")))
        .toEqual([true, true, false, false]);
      expect(scids.map(scid=>match(scid, "thig1.3, thig1.2")))
        .toEqual([false, false, true, true]);
      expect(scids.map(scid=>match(scid, "thig1.1, thig1.2")))
        .toEqual([true, true, true, true]);
      expect(scids.map(scid=>match(scid, "thig1.1")))
        .toEqual([true, true, false, false]);
      expect(scids.map(scid=>match(scid, "thig1.2")))
        .toEqual([false, false, true, true]);
      expect(scids.map(scid=>match(scid, "thig1.1:1.2")))
        .toEqual([false, true, false, false]);
      expect(scids.map(scid=>match(scid, "thig1.2:1.1")))
        .toEqual([false, false, true, false]);
    });
    it("match(scid, pat) MIL", ()=>{
      let scid312 = "mil3.1.2";
      let match = SuttaCentralId.match;
      expect(match(`${scid312}:1.2`, scid312)).toBe(true);
    });
    it("compareLow(a,b) compares sutta file names MIL", function () {
      var cmp = SuttaCentralId.compareLow;
      testCompareLow("mil3.1.2", "mil3.1.5", -3);
    });
    it("rangeHigh => upper bound MIL", () => {
      expect(SuttaCentralId.rangeHigh("mil3.1.2--mil3.1.9")).toBe("mil3.1.9");
    });
    it("nikaya return nikaya id MIL", function () {
      var scid = new SuttaCentralId("mil3.1.2");
      expect(scid.nikaya).toBe("mil");

      var scid = new SuttaCentralId("mil3.1.2:2.3.4");
      expect(scid.nikaya).toBe("mil");

      var scid = new SuttaCentralId("mil3.1.2-8:2.3.4");
      expect(scid.nikaya).toBe("mil");
    });
    it("custom ctor", function () {
      // sutta id
      var scid = new SuttaCentralId("mn1");
      expect(scid).toBeInstanceOf(SuttaCentralId);
      expect(scid.toString()).toBe("mn1");

      // segment id
      var scid = new SuttaCentralId("mn1:2.3.4");
      expect(scid).toBeInstanceOf(SuttaCentralId);
      expect(scid.toString()).toBe("mn1:2.3.4");
    });
    it("compareLow(a,b) compares sutta file names", function () {
      var cmp = SuttaCentralId.compareLow;

      // vinaya
      testCompareLow("pli-tv-bi-vb-sk1", "pli-tv-bi-vb-sk75", -74);

      assertLess(SuttaCentralId.compareLow, "an1.150:0.2", "an1.152-159:0.1");
      assertLess(
        SuttaCentralId.compareLow,
        "an1.152-159:0.1",
        "an1.162-169:0.1"
      );
      assertLess(SuttaCentralId.compareLow, "an1.150:0.1", "an1.162-169:0.1");

      assertEqual(
        SuttaCentralId.compareLow,
        `${en_suj}sn/sn22/sn22.11_translation-en-sujato.json`,
        "translation/en/sujato/sn/sn22/sn22.11-20_translation-en-sujato.json"
      );
      assertLess(
        SuttaCentralId.compareLow,
        "translation/en/sujato/sn/sn22/sn22.2_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.11-20_translation-en-sujato.json"
      );
      assertLess(
        SuttaCentralId.compareLow,
        "translation/en/sujato/sn/sn22/sn22.1_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.2_translation-en-sujato.json"
      );
      assertLess(
        SuttaCentralId.compareLow,
        "translation/en/sujato/sn/sn22/sn22.2_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.10_translation-en-sujato.json"
      );

      // misc
      expect(cmp("an1.1", "an2.11-20")).toBe(-1);
      expect(cmp("an1.1", "an2.011-20")).toBe(-1);
      expect(cmp("an1.100", "an2.11-20")).toBe(-1);
      expect(cmp("an1.100", "an2.011-020")).toBe(-1);
      expect(cmp("an2.1", "an2.11-20")).toBe(-10);
      expect(cmp("an2.1", "an2.011-020")).toBe(-10);
      expect(cmp("an2.5", "an2.11-20")).toBe(-6);
      expect(cmp("an2.10", "an2.11-20")).toBe(-1);
      expect(cmp("an2.11", "an2.11-20")).toBe(0);
      expect(cmp("an2.21", "an2.11-20")).toBe(10);
      expect(cmp("an2.100", "an2.11-20")).toBe(89);
      expect(cmp("an3.1", "an2.11-20")).toBe(1);
      expect(cmp("an3.1", "an2.011-020")).toBe(1);
      expect(cmp("an1", "dn2")).toBe(-1);
      expect(cmp("an9.1", "dn2")).toBe(-1);
      expect(cmp("dn2", "mn1")).toBe(-1);
      expect(cmp("an2.1-10", "an2.11-20")).toBe(-10);

      // Standalone
      expect(cmp("mn33", "mn33")).toBe(0);
      expect(cmp("mn33", "mn34")).toBe(-1);
      expect(cmp("mn34", "mn33")).toBe(1);

      // collection suttacentral order
      expect(cmp("sn/en/sujato/sn22.1", "an/en/sujato/an22.1")).toBe(1);
      expect(cmp("an/en/sujato/an22.1", "sn/en/sujato/sn22.1")).toBe(-1);
      expect(cmp("xx/en/sujato/sn22.1", "xx/en/sujato/an22.1")).toBe(1);
      expect(cmp("xx/en/sujato/an22.1", "xx/en/sujato/sn22.1")).toBe(-1);

      // major number
      expect(cmp("sn/en/sujato/sn29.1", "sn/en/sujato/sn22.1")).toBe(7);
      expect(cmp("sn/en/sujato/sn22.1", "sn/en/sujato/sn29.1")).toBe(-7);

      // subchapter numbering
      expect(cmp("sn/en/sujato/sn30.1", "sn/en/sujato/sn30.2")).toBe(-1);
      expect(cmp("sn/en/sujato/sn29.1", "sn/en/sujato/sn29.10")).toBe(-9);
      expect(cmp("sn/en/sujato/sn29.10", "sn/en/sujato/sn29.1")).toBe(9);
      expect(cmp("sn/en/sujato/sn29.1", "sn/en/sujato/sn29.11-20")).toBe(-10);
      expect(cmp("sn/en/sujato/sn29.11-20", "sn/en/sujato/sn29.1")).toBe(10);
      expect(cmp("sn/en/sujato/sn29.10", "sn/en/sujato/sn29.11-20")).toBe(-1);
      expect(cmp("sn/en/sujato/sn29.11-20", "sn/en/sujato/sn29.10")).toBe(1);

      // ranges
      expect(cmp("sn29.11-20", "sn29.11-20")).toBe(0);
      expect(cmp("sn29.11-20", "sn29.10")).toBe(1);
      expect(cmp("sn29.11-20", "sn29.11")).toBe(0);
      expect(cmp("sn29.11-20", "sn29.12")).toBe(-1);
      expect(cmp("sn29.21", "sn29.20")).toBe(1);
      expect(cmp("sn29.21", "sn29.21")).toBe(0);
      expect(cmp("sn29.21", "sn29.22")).toBe(-1);

      expect(cmp("an1.1-10", "an1.1-10")).toBe(0);
      expect(cmp("an1.1", "an1.1-10")).toBe(0);
      expect(cmp("an1.10", "an1.1-10")).toBe(9);
    });
    it("compare nested segment id an1.102-109:1.1", () => {
      let segId = 'an1.102-109:1.1';
      let docId = 'an1.98-139';
      let prevDocId = 'an1.82-97';
      let nextDocId = 'an1.140-149';

      expect(SuttaCentralId.compareLow(segId, prevDocId)).toBe(20);
      expect(SuttaCentralId.compareHigh(segId, prevDocId)).toBe(12);
      expect(SuttaCentralId.compareLow(segId, docId)).toBe(4);
      expect(SuttaCentralId.compareHigh(segId, docId)).toBe(-30);
      expect(SuttaCentralId.compareLow(segId, nextDocId)).toBe(-38);
      expect(SuttaCentralId.compareHigh(segId, nextDocId)).toBe(-40);

      expect(SuttaCentralId.compareLow(prevDocId, segId)).toBe(-20);
      expect(SuttaCentralId.compareHigh(prevDocId, segId)).toBe(-12);
      expect(SuttaCentralId.compareLow(docId, segId)).toBe(-4);
      expect(SuttaCentralId.compareHigh(docId, segId)).toBe(30);
      expect(SuttaCentralId.compareLow(nextDocId, segId)).toBe(38);
      expect(SuttaCentralId.compareHigh(nextDocId, segId)).toBe(40);
    });
    it("compare nested segment id an1.98:1.1", () => {
      let segId = 'an1.98-109:1.1';
      let docId = 'an1.98-139';
      let prevDocId = 'an1.82-97';
      let nextDocId = 'an1.140-149';

      expect(SuttaCentralId.compareLow(segId, prevDocId)).toBe(16);
      expect(SuttaCentralId.compareHigh(segId, prevDocId)).toBe(12);
      expect(SuttaCentralId.compareLow(segId, docId)).toBe(1);
      expect(SuttaCentralId.compareHigh(segId, docId)).toBe(-30);
      expect(SuttaCentralId.compareLow(segId, nextDocId)).toBe(-42);
      expect(SuttaCentralId.compareHigh(segId, nextDocId)).toBe(-40);

      expect(SuttaCentralId.compareLow(prevDocId, segId)).toBe(-16);
      expect(SuttaCentralId.compareHigh(prevDocId, segId)).toBe(-12);
      expect(SuttaCentralId.compareLow(docId, segId)).toBe(-1);
      expect(SuttaCentralId.compareHigh(docId, segId)).toBe(30);
      expect(SuttaCentralId.compareLow(nextDocId, segId)).toBe(42);
      expect(SuttaCentralId.compareHigh(nextDocId, segId)).toBe(40);
    });
    it("compareLow(a,b) compares segment ids", () => {
      // Zeroes
      testCompareLow("dn2:75.3.0", "dn2:75.3", 1);

      // vinaya
      testCompareLow("pli-tv-kd15:17.3.2^a", "pli-tv-kd15:17.3.2", -26);
      testCompareLow("pli-tv-kd15:17.3", "pli-tv-kd15:17.3.2", -2);
      testCompareLow("pli-tv-kd15:17.3.2^a", "pli-tv-kd15:17.3.2^c", -2);
      testCompareLow("pli-tv-kd15:17.3.2a", "pli-tv-kd15:17.3.2", 1);
      testCompareLow("pli-tv-kd15:17.3.2a", "pli-tv-kd15:17.3.2c", -2);
      testCompareLow("pli-tv-kd15:17.3.2^a", "pli-tv-kd15:17.3.2a", -27);

      testCompareLow("dn33:1.2.31", "dn33:1.10.1", -8);

      testCompareLow("an1.150:0.2", "an1.152-159:0.1", -2);
      testCompareLow("an1.152-159:0.1", "an1.162-169:0.1", -10);
      testCompareLow("an1.150:0.1", "an1.162-169:0.1", -12);

      testCompareLow("an1.2:2.3", "an1.10:0.1", -8);
      testCompareLow("an1.2:0.1", "an1.10:0.1", -8);
      testCompareLow("dn33", "dn33", 0);
      testCompareLow("sn2.1", "dn33", 1);
      testCompareLow("dn33:1.2.31", "dn33:1.10.1", -8);
      testCompareLow("dn33:1.10.31", "dn33:1.10.31", 0);
      testCompareLow("dn33:1.10.31", "dn33:2.10.31", -1);
      testCompareLow("dn33:1.1.31", "dn33:1.10.31", -9);
      testCompareLow("dn33:1.1", "dn33:1.1", 0);
      testCompareLow("dn33:1.1", "dn33:1.11", -10);
      testCompareLow("dn33:1.1", "dn33:1.1.0", -1);
      testCompareLow("dn33:1.10.1", "dn33:1.2.0", 8);
    });
    it("compareLow(a,b) compares vinaya ids", () => {
      testCompareLow('pli-tv-bu-pm', 'an1.1', 1);
    });
    it("compareHigh(a,b) compares sutta file names", function () {
      var cmp = SuttaCentralId.compareHigh;

      assertEqual(
        SuttaCentralId.compareHigh,
        "translation/en/sujato/sn/sn22/sn22.20_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.11-20_translation-en-sujato.json"
      );
      assertLess(
        SuttaCentralId.compareHigh,
        "translation/en/sujato/sn/sn22/sn22.2_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.11-20_translation-en-sujato.json"
      );
      assertLess(
        SuttaCentralId.compareHigh,
        "translation/en/sujato/sn/sn22/sn22.1_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.2_translation-en-sujato.json"
      );
      assertLess(
        SuttaCentralId.compareHigh,
        "translation/en/sujato/sn/sn22/sn22.2_translation-en-sujato.json",
        "translation/en/sujato/sn/sn22/sn22.10_translation-en-sujato.json"
      );

      // misc
      expect(cmp("an1.1", "an2.11-20")).toBe(-1);
      expect(cmp("an1.1", "an2.011-20")).toBe(-1);
      expect(cmp("an1.100", "an2.11-20")).toBe(-1);
      expect(cmp("an1.100", "an2.011-020")).toBe(-1);
      expect(cmp("an2.1", "an2.11-20")).toBe(-19);
      expect(cmp("an2.1", "an2.011-020")).toBe(-19);
      expect(cmp("an2.5", "an2.11-20")).toBe(-15);
      expect(cmp("an2.10", "an2.11-20")).toBe(-10);
      expect(cmp("an2.11", "an2.11-20")).toBe(-9);
      expect(cmp("an2.21", "an2.11-20")).toBe(1);
      expect(cmp("an2.100", "an2.11-20")).toBe(80);
      expect(cmp("an3.1", "an2.11-20")).toBe(1);
      expect(cmp("an3.1", "an2.011-020")).toBe(1);
      expect(cmp("an1", "dn2")).toBe(-1);
      expect(cmp("an9.1", "dn2")).toBe(-1);
      expect(cmp("dn2", "mn1")).toBe(-1);
      expect(cmp("an2.1-10", "an2.11-20")).toBe(-10);

      // Standalone
      expect(cmp("mn33", "mn33")).toBe(0);
      expect(cmp("mn33", "mn34")).toBe(-1);
      expect(cmp("mn34", "mn33")).toBe(1);

      // collection
      expect(cmp("sn/en/sujato/sn22.1", "an/en/sujato/an22.1")).toBe(1);
      expect(cmp("an/en/sujato/an22.1", "sn/en/sujato/sn22.1")).toBe(-1);
      expect(cmp("xx/en/sujato/sn22.1", "xx/en/sujato/an22.1")).toBe(1);
      expect(cmp("xx/en/sujato/an22.1", "xx/en/sujato/sn22.1")).toBe(-1);

      // major number
      expect(cmp("sn/en/sujato/sn29.1", "sn/en/sujato/sn22.1")).toBe(7);
      expect(cmp("sn/en/sujato/sn22.1", "sn/en/sujato/sn29.1")).toBe(-7);

      // subchapter numbering
      expect(cmp("sn/en/sujato/sn30.1", "sn/en/sujato/sn30.2")).toBe(-1);
      expect(cmp("sn/en/sujato/sn29.1", "sn/en/sujato/sn29.10")).toBe(-9);
      expect(cmp("sn/en/sujato/sn29.10", "sn/en/sujato/sn29.1")).toBe(9);
      expect(cmp("sn/en/sujato/sn29.1", "sn/en/sujato/sn29.11-20")).toBe(-19);
      expect(cmp("sn/en/sujato/sn29.11-20", "sn/en/sujato/sn29.1")).toBe(19);
      expect(cmp("sn/en/sujato/sn29.10", "sn/en/sujato/sn29.11-20")).toBe(-10);
      expect(cmp("sn/en/sujato/sn29.11-20", "sn/en/sujato/sn29.10")).toBe(10);

      // ranges
      expect(cmp("sn29.11-20", "sn29.11-20")).toBe(0);
      expect(cmp("sn29.11-20", "sn29.10")).toBe(10);
      expect(cmp("sn29.11-20", "sn29.11")).toBe(9);
      expect(cmp("sn29.11-20", "sn29.12")).toBe(8);
      expect(cmp("sn29.21", "sn29.20")).toBe(1);
      expect(cmp("sn29.21", "sn29.21")).toBe(0);
      expect(cmp("sn29.21", "sn29.22")).toBe(-1);

      expect(cmp("an1.1-10", "an1.1-10")).toBe(0);
      expect(cmp("an1.1", "an1.1-10")).toBe(-9);
      expect(cmp("an1.10", "an1.1-10")).toBe(0);
    });
    it("sutta return sutta id", function () {
      var scid = new SuttaCentralId("mn1");
      expect(scid.sutta).toBe("mn1");

      var scid = new SuttaCentralId("mn1:2.3.4");
      expect(scid.sutta).toBe("mn1");

      var scid = new SuttaCentralId("sn1.11-20:2.3.4");
      expect(scid.sutta).toBe("sn1.11-20");
    });
    it("nikaya return nikaya id", function () {
      var scid = new SuttaCentralId("mn1");
      expect(scid.nikaya).toBe("mn");

      var scid = new SuttaCentralId("mn1:2.3.4");
      expect(scid.nikaya).toBe("mn");

      var scid = new SuttaCentralId("sn1.11-20:2.3.4");
      expect(scid.nikaya).toBe("sn");
    });
    it("nikayaFolder => nikaya folder", function () {
      // DEPRECATED
      var scid = new SuttaCentralId("thag21.7");
      expect(scid.nikayaFolder).toBe("kn/thag");

      var scid = new SuttaCentralId("mn1");
      expect(scid.nikayaFolder).toBe("mn");

      var scid = new SuttaCentralId("mn1:2.3.4");
      expect(scid.nikayaFolder).toBe("mn");

      var scid = new SuttaCentralId("sn1.11-20:2.3.4");
      expect(scid.nikayaFolder).toBe("sn/sn1");
    });
    it("parent returns parent SuttaCentralId", function () {
      var scid = new SuttaCentralId("mn1");
      expect(scid.parent).toBe(null);

      var scid = new SuttaCentralId("mn1:2.");
      expect(scid.parent).toBeInstanceOf(SuttaCentralId);
      expect(scid.parent.scid).toBe("mn1:");

      var scid = new SuttaCentralId("mn1:2.3.4");
      expect(scid.parent).toBeInstanceOf(SuttaCentralId);
      expect(scid.parent.scid).toBe("mn1:2.3.");
    });
    it("scidRegExp(pat) creates a scid wildcard pattern", function () {
      // should be same as Linux file wildcards
      expect(SuttaCentralId.scidRegExp("mn1:2.3")).toEqual(/mn1:2\.3/);
      expect(SuttaCentralId.scidRegExp("mn1:2.*")).toEqual(/mn1:2\..*/);
      expect(SuttaCentralId.scidRegExp("mn1:2.?")).toEqual(/mn1:2\../);
      expect(
        SuttaCentralId.scidRegExp("mn1:[2-3].*")
      ).toEqual(/mn1:[2-3]\..*/);
      expect(SuttaCentralId.scidRegExp("^mn1:2.3")).toEqual(/\^mn1:2\.3/);
      expect(SuttaCentralId.scidRegExp("mn1:2.3$")).toEqual(/mn1:2\.3\$/);
    });
    it("groups returns array of groups", function () {
      var scid = new SuttaCentralId("mn1:2.3.4");
      expect(scid.groups).toEqual(["2", "3", "4"]);
      var scid = new SuttaCentralId("mn1");
      expect(scid.groups).toBeNull();
    });
    it("test(text) => text is suid ", function () {
      // vinaya
      expect(SuttaCentralId.test("pli-tv-bi-vb-sk1-75")).toBe(true);

      // space
      expect(SuttaCentralId.test("an3. 90")).toBe(true);
      expect(SuttaCentralId.test("an3.  90")).toBe(true);
      expect(SuttaCentralId.test("mn 1-10")).toBe(true);
      expect(SuttaCentralId.test("mn 1")).toBe(true);

      // unsupported sutta
      expect(SuttaCentralId.test("t1670b2.8")).toBe(true);

      // fully specified sutta
      expect(SuttaCentralId.test("mn1/en/sujato")).toBe(true);
      expect(SuttaCentralId.test("mn1/en/sujato,mn1/en/bodhi")).toBe(true);
      expect(
        SuttaCentralId.test("dn7/de/kusalagnana-maitrimurti-traetow")
      ).toBe(true);

      // valid collection with a number
      expect(SuttaCentralId.test("mn2000")).toBe(true);
      expect(SuttaCentralId.test("an1")).toBe(true);
      expect(SuttaCentralId.test("sn22.1")).toBe(true);
      expect(SuttaCentralId.test("sn22.1-20")).toBe(true);
      expect(SuttaCentralId.test("mn8-11")).toBe(true);
      expect(SuttaCentralId.test("mn8-11,mn9-12")).toBe(true);

      // unknown but valid sutta
      expect(SuttaCentralId.test("a1")).toBe(true);
      expect(SuttaCentralId.test("mn01")).toBe(true);

      // not a sutta_uid pattern
      expect(SuttaCentralId.test("red")).toBe(false);
      expect(SuttaCentralId.test("thig")).toBe(false);
      expect(SuttaCentralId.test("mn")).toBe(false);

      // lists
      expect(SuttaCentralId.test("mn1, mn2")).toBe(true);
      expect(SuttaCentralId.test("sn22-25")).toBe(true);
      expect(SuttaCentralId.test("sn22.1-20,mn1")).toBe(true);
      expect(SuttaCentralId.test("sn22.1-20   ,   mn1")).toBe(true);
      expect(SuttaCentralId.test("sn22.1-20,red")).toBe(false);
      expect(SuttaCentralId.test("red,sn22.1-20,mn1")).toBe(false);
      expect(SuttaCentralId.test("sn22.1-20    ,   red")).toBe(false);
      expect(SuttaCentralId.test("red,sn22.1-20")).toBe(false);
    });
    it("rangeHigh => upper bound", () => {
      expect(SuttaCentralId.rangeHigh("an1.10--an1.11")).toBe("an1.11");
      expect(SuttaCentralId.rangeHigh("an1.2:3.4--5.6")).toBe(
        "an1.2:5.6.9999"
      );
      expect(
        SuttaCentralId.rangeHigh("an1.2:2.1.3--an1.11:5.1.19/en/sujato")
      ).toBe("an1.11:5.1.19.9999/en/sujato");
      expect(SuttaCentralId.rangeHigh("an1.2-11:2-5.1.3-19/en/sujato")).toBe(
        "an1.11:5.1.19.9999/en/sujato"
      );
      expect(SuttaCentralId.rangeHigh("an1.2-11:2-5.1.3-19")).toBe(
        "an1.11:5.1.19.9999"
      );
      expect(SuttaCentralId.rangeHigh("an1.2-11")).toBe("an1.11");
      expect(SuttaCentralId.rangeHigh("an1.2")).toBe("an1.2");
      expect(SuttaCentralId.rangeHigh("mn1")).toBe("mn1");
    });
    it("rangeLow => lower bound", () => {
      expect(
        SuttaCentralId.rangeLow("an1.2:2.1.3--an1.11:5.1.19/en/sujato")
      ).toBe("an1.2:2.1.3/en/sujato");
      expect(SuttaCentralId.rangeLow("an1.2:3.4--5.6")).toBe("an1.2:3.4");
      expect(SuttaCentralId.rangeLow("an1.2-11:2-5.1.3-19/en/sujato")).toBe(
        "an1.2:2.1.3/en/sujato"
      );
      expect(SuttaCentralId.rangeLow("an1.2-11:2-5.1.3-19")).toBe(
        "an1.2:2.1.3"
      );
      expect(SuttaCentralId.rangeLow("an1.2-11")).toBe("an1.2");
      expect(SuttaCentralId.rangeLow("an1.2")).toBe("an1.2");
      expect(SuttaCentralId.rangeLow("mn1")).toBe("mn1");
    });
    it("add(...) increments number", () => {
      var segid = new SuttaCentralId("an1.1:0.1");
      expect(segid.add(1).scid).toBe("an1.1:1.0");
      expect(segid.add(0, 1).scid).toBe("an1.1:0.2");

      var suid = new SuttaCentralId("an1.1");
      expect(suid.add(1).scid).toBe("an2.1");
      expect(suid.add(0, 1).scid).toBe("an1.2");
    });
    it("standardForm() => human standard", () => {
      var segid = new SuttaCentralId("an1.1:0.1");
      expect(segid.standardForm()).toBe("AN1.1:0.1");
      var segid = new SuttaCentralId("thag1.1:2.3");
      expect(segid.standardForm()).toBe("Thag1.1:2.3");
    });
    it("partNumber()", ()=>{
      expect(SuttaCentralId.partNumber("Mn1", "Mn1:50.2"), 
        [1,13]);
      expect(SuttaCentralId.partNumber("mn1", "mn1:50.2"), 
        [1,13]);
    });
    it("compare vinaya ids", ()=>{
      let suid = 'pli-tv-pvr5'; // Valid vinaya document
      DBG.COMPARE = 0;
      expect(SuttaCentralId.compareHigh('abc', suid)).toBe(-1);
      expect(SuttaCentralId.compareLow('abc', suid)).toBe(-1);
      expect(SuttaCentralId.compareHigh('xyz', suid)).toBe(1);
      expect(SuttaCentralId.compareLow('xyz', suid)).toBe(1);
      DBG.COMPARE = 0;
    });
  });
