import { Tipitaka } from "../main.mjs";
import should from "should";

typeof describe === "function" && describe("tipitaka", function () {
  it("default constructor", () => {
    let taka = new Tipitaka();

    should.deepEqual(taka.suids.slice(0, 3), [
      "an1.1-10",
      "an1.11-20",
      "an1.21-30",
    ]);
  });
  it("nextSuid(id), previousSuid(id) traverses nikaya", () => {
    let taka = new Tipitaka();

    // within nikaya
    should(taka.nextSuid("an4.99")).equal("an4.100");
    should(taka.previousSuid("an4.100")).equal("an4.99");
    should(taka.nextSuid("an1.1")).equal("an1.1-10");
    should(taka.nextSuid("an1.10")).equal("an1.11-20");
    should(taka.previousSuid("an1.2")).equal("an1.1-10");
    should(taka.previousSuid("an1.12")).equal("an1.11-20");

    // boundaries
    should(taka.nextSuid("mn152")).equal(null);
    should(taka.previousSuid("an1.1")).equal(null);
    should(taka.previousSuid("mn1")).equal(null);
    should(taka.previousSuid("mnd1")).equal(null);
  });
  it("canonicalSuttaId(id)", ()=>{
    let taka = new Tipitaka();
    should(taka.canonicalSuttaId('an2.11-20')).equal('AN2.11-20');
    should(taka.canonicalSuttaId('AN2.11-20')).equal('AN2.11-20');
    should(taka.canonicalSuttaId('An2.11-20')).equal('AN2.11-20');

    // name
    should(taka.canonicalSuttaId('an2.12', 'name'))
      .equal('Aṅguttara Nikāya 2.12');
    should(taka.canonicalSuttaId('AN2.12', 'name'))
      .equal('Aṅguttara Nikāya 2.12');
    should(taka.canonicalSuttaId('An2.12', 'name'))
      .equal('Aṅguttara Nikāya 2.12');

    // MN44
    should(taka.canonicalSuttaId('mn44')).equal('MN44');
    should(taka.canonicalSuttaId('mn44', 'acro')).equal('MN44');
    should(taka.canonicalSuttaId('mn44', 'name'))
      .equal('Majjhima Nikāya 44');

    // other
    should(taka.canonicalSuttaId('thig1.1')).equal('Thig1.1');
    should(taka.canonicalSuttaId('thig1.1', 'name'))
      .equal('Therīgāthā 1.1');
    should(taka.canonicalSuttaId('snp1.1')).equal('Snp1.1');
    should(taka.canonicalSuttaId('snp1.1', 'name'))
      .equal('Sutta Nipāta 1.1');
  });
});
