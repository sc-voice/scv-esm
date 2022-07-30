import { SuidMap } from "../main.mjs";
import should from "should";

typeof describe === "function" &&
  describe("suid-map", function () {
    this.timeout(1 * 1000);

    it("thig1.1", () => {
      let thig1_1 = SuidMap["thig1.1"];
      should.deepEqual(thig1_1, {
        "translation/de/sabbamitta": "sutta/kn/thig",
        "translation/en/soma": "sutta/kn/thig",
        "translation/en/sujato": "sutta/kn/thig",
        "root/pli/ms": "sutta/kn/thig"
      });
    });
  });
