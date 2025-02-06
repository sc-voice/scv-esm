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
  it("folderOfSuid()", () => {
    should(Tipitaka.folderOfSuid("pli-tv-pvr1.10"))
    .equal("pli-tv-pvr");
    should(Tipitaka.folderOfSuid("pli-tv-bi-vb-as1-7"))
    .equal("pli-tv-bi-vb-as");
    should(Tipitaka.folderOfSuid("pli-tv-bi-vb-pd2-8"))
    .equal("pli-tv-bi-vb-pd");
    should(Tipitaka.folderOfSuid("pli-tv-bi-vb-np10"))
    .equal("pli-tv-bi-vb-np");
    should(Tipitaka.folderOfSuid("tha-ap100")).equal("tha-ap");
    should(Tipitaka.folderOfSuid("snp2.10")).equal("snp");
    should(Tipitaka.folderOfSuid("mil3.1.11")).equal("mil");
    should(Tipitaka.folderOfSuid("dhp320-323")).equal("dhp");
    should(Tipitaka.folderOfSuid("kp10")).equal("kp");
    should(Tipitaka.folderOfSuid("bv10")).equal("bv");
    should(Tipitaka.folderOfSuid("ja10")).equal("ja");
    should(Tipitaka.folderOfSuid("iti10")).equal("iti");
    should(Tipitaka.folderOfSuid("cnd10")).equal("cnd");
    should(Tipitaka.folderOfSuid("thig1.1")).equal("thig");
    should(Tipitaka.folderOfSuid("thig11.1")).equal("thig");
    should(Tipitaka.folderOfSuid("an1.1-10")).equal("an1");
    should(Tipitaka.folderOfSuid("sn1.17")).equal("sn1");
  });
  it("nextSuid(id)", () => {
    let taka = new Tipitaka();

    // within nikaya
    should(taka.nextSuid("an11.454-501")).equal("an11.502-981");
    should(taka.nextSuid("an1.1-10")).equal("an1.11-20");
    should(taka.nextSuid("an4.99")).equal("an4.100");
    should(taka.nextSuid("an1.1")).equal("an1.1-10");
    should(taka.nextSuid("an1.10")).equal("an1.11-20");

    // boundaries
    should(taka.nextSuid("THIG4.1")).equal("thig5.1");
    should(taka.nextSuid("thig4.1")).equal("thig5.1");
    should(taka.nextSuid("thig1.18")).equal("thig2.1");
    should(taka.nextSuid("an1.616-627")).equal("an2.1-10");
    should(taka.nextSuid("an11.992-1151")).equal(null);
    should(taka.nextSuid("mn152")).equal(null);
  });
  it("nextSuid() folderOfGroup", () => {
    let taka = new Tipitaka();
    let grp = Tipitaka.folderOfSuid;

    // within nikaya
    should(taka.nextSuid("sn1.80",grp)).equal("sn1.81");
    should(taka.nextSuid("an11.454-501",grp)).equal("an11.502-981");
    should(taka.nextSuid("an1.1-10",grp)).equal("an1.11-20");
    should(taka.nextSuid("an4.99",grp)).equal("an4.100");
    should(taka.nextSuid("an1.1",grp)).equal("an1.1-10");
    should(taka.nextSuid("an1.10",grp)).equal("an1.11-20");
    should(taka.nextSuid("tha-ap34",grp)).equal("tha-ap35");

    // boundaries
    should(taka.nextSuid("sn1.81",grp)).equal(null);
    should(taka.nextSuid("THIG4.1",grp)).equal("thig5.1");
    should(taka.nextSuid("thig4.1",grp)).equal("thig5.1");
    should(taka.nextSuid("thig1.18",grp)).equal("thig2.1");
    should(taka.nextSuid("an1.616-627",grp)).equal(null);
    should(taka.nextSuid("an11.992-1151",grp)).equal(null);
    should(taka.nextSuid("mn152",grp)).equal(null);
  });
  it("previousSuid(id) traverses nikaya", () => {
    let taka = new Tipitaka();

    // within nikaya
    should(taka.previousSuid("an4.100")).equal("an4.99");
    should(taka.previousSuid("an1.2")).equal("an1.1-10");
    should(taka.previousSuid("an1.12")).equal("an1.11-20");

    // boundaries
    should(taka.previousSuid("an1.1")).equal(null);
    should(taka.previousSuid("mn1")).equal(null);
    should(taka.previousSuid("mnd1")).equal(null);
  });
  it("canonicalSuttaId(id)", ()=>{
    let taka = new Tipitaka();

    // Hyphens
    should(taka.canonicalSuttaId('tha-ap34-35')).equal('Tha Ap34-35');

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
