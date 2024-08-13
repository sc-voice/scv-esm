import { SuidMap } from "../main.mjs";
import should from "should";

typeof describe === "function" &&
  describe("suid-map", function () {
    this.timeout(1 * 1000);

    it("thig1.1", () => {
      let thig1_1 = SuidMap["thig1.1"];
      should.deepEqual(thig1_1, {
        "translation/ru/narinyanievmenenko": "sutta/kn/thig",
        "translation/de/sabbamitta": "sutta/kn/thig",
        "translation/en/soma": "sutta/kn/thig",
        "translation/en/sujato": "sutta/kn/thig",
        "root/pli/ms": "sutta/kn/thig"
      });
    });
    it("tha-ap34", () => {
      let suidInfo = SuidMap["tha-ap34"];
      should.deepEqual(suidInfo, {
        "root/pli/ms": "sutta/kn/tha-ap"
      });
    });
  });
