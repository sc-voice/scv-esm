import { expect, describe, it } from "vitest";
import { SuidMap } from "../main.mjs";

describe("suid-map", () => {
    it("thig1.1", () => {
      let thig1_1 = SuidMap["thig1.1"];
      expect(thig1_1).toEqual({
        "root/pli/ms": "sutta/kn/thig",
        "translation/de/sabbamitta": "sutta/kn/thig",
        "translation/de/sonjabuege": "sutta/kn/thig",
        "translation/en/soma": "sutta/kn/thig",
        "translation/en/sujato": "sutta/kn/thig",
        "translation/ru/narinyanievmenenko": "sutta/kn/thig",
        "translation/tr/dogensisapa": "sutta/kn/thig",
      });
    });
    it("tha-ap34", () => {
      let suidInfo = SuidMap["tha-ap34"];
      expect(suidInfo).toEqual({
        "root/pli/ms": "sutta/kn/tha-ap"
      });
    });
  });
