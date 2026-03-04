import { expect, describe, it } from "@sc-voice/vitest";
import { Tipitaka } from "../main.mjs";

describe("tipitaka", () => {
  it("default constructor", () => {
    let taka = new Tipitaka();

    expect(taka.suids.slice(0, 3)).toEqual([
      "an1.1-10",
      "an1.11-20",
      "an1.21-30",
    ]);
  });
  it("folderOfSuid()", () => {
    expect(Tipitaka.folderOfSuid("pli-tv-pvr1.10"))
    .toBe("pli-tv-pvr");
    expect(Tipitaka.folderOfSuid("pli-tv-bi-vb-as1-7"))
    .toBe("pli-tv-bi-vb-as");
    expect(Tipitaka.folderOfSuid("pli-tv-bi-vb-pd2-8"))
    .toBe("pli-tv-bi-vb-pd");
    expect(Tipitaka.folderOfSuid("pli-tv-bi-vb-np10"))
    .toBe("pli-tv-bi-vb-np");
    expect(Tipitaka.folderOfSuid("tha-ap100")).toBe("tha-ap");
    expect(Tipitaka.folderOfSuid("snp2.10")).toBe("snp");
    expect(Tipitaka.folderOfSuid("mil3.1.11")).toBe("mil");
    expect(Tipitaka.folderOfSuid("dhp320-323")).toBe("dhp");
    expect(Tipitaka.folderOfSuid("kp10")).toBe("kp");
    expect(Tipitaka.folderOfSuid("bv10")).toBe("bv");
    expect(Tipitaka.folderOfSuid("ja10")).toBe("ja");
    expect(Tipitaka.folderOfSuid("iti10")).toBe("iti");
    expect(Tipitaka.folderOfSuid("cnd10")).toBe("cnd");
    expect(Tipitaka.folderOfSuid("thig1.1")).toBe("thig");
    expect(Tipitaka.folderOfSuid("thig11.1")).toBe("thig");
    expect(Tipitaka.folderOfSuid("an1.1-10")).toBe("an1");
    expect(Tipitaka.folderOfSuid("sn1.17")).toBe("sn1");
  });
  it("nextSuid(id)", () => {
    let taka = new Tipitaka();

    // within nikaya
    expect(taka.nextSuid("an11.454-501")).toBe("an11.502-981");
    expect(taka.nextSuid("an1.1-10")).toBe("an1.11-20");
    expect(taka.nextSuid("an4.99")).toBe("an4.100");
    expect(taka.nextSuid("an1.1")).toBe("an1.1-10");
    expect(taka.nextSuid("an1.10")).toBe("an1.11-20");

    // boundaries
    expect(taka.nextSuid("THIG4.1")).toBe("thig5.1");
    expect(taka.nextSuid("thig4.1")).toBe("thig5.1");
    expect(taka.nextSuid("thig1.18")).toBe("thig2.1");
    expect(taka.nextSuid("an1.616-627")).toBe("an2.1-10");
    expect(taka.nextSuid("an11.992-1151")).toBe(null);
    expect(taka.nextSuid("mn152")).toBe(null);
  });
  it("nextSuid() folderOfGroup", () => {
    let taka = new Tipitaka();
    let grp = Tipitaka.folderOfSuid;

    // within nikaya
    expect(taka.nextSuid("sn1.80",grp)).toBe("sn1.81");
    expect(taka.nextSuid("an11.454-501",grp)).toBe("an11.502-981");
    expect(taka.nextSuid("an1.1-10",grp)).toBe("an1.11-20");
    expect(taka.nextSuid("an4.99",grp)).toBe("an4.100");
    expect(taka.nextSuid("an1.1",grp)).toBe("an1.1-10");
    expect(taka.nextSuid("an1.10",grp)).toBe("an1.11-20");
    expect(taka.nextSuid("tha-ap34",grp)).toBe("tha-ap35");

    // boundaries
    expect(taka.nextSuid("sn1.81",grp)).toBe(null);
    expect(taka.nextSuid("THIG4.1",grp)).toBe("thig5.1");
    expect(taka.nextSuid("thig4.1",grp)).toBe("thig5.1");
    expect(taka.nextSuid("thig1.18",grp)).toBe("thig2.1");
    expect(taka.nextSuid("an1.616-627",grp)).toBe(null);
    expect(taka.nextSuid("an11.992-1151",grp)).toBe(null);
    expect(taka.nextSuid("mn152",grp)).toBe(null);
  });
  it("previousSuid(id) traverses nikaya", () => {
    let taka = new Tipitaka();

    // within nikaya
    expect(taka.previousSuid("an4.100")).toBe("an4.99");
    expect(taka.previousSuid("an1.2")).toBe("an1.1-10");
    expect(taka.previousSuid("an1.12")).toBe("an1.11-20");

    // boundaries
    expect(taka.previousSuid("an1.1")).toBe(null);
    expect(taka.previousSuid("mn1")).toBe(null);
    expect(taka.previousSuid("mnd1")).toBe(null);
  });
  it("canonicalSuttaId(id)", ()=>{
    let taka = new Tipitaka();

    // Hyphens
    expect(taka.canonicalSuttaId('tha-ap34-35')).toBe('Tha Ap34-35');

    expect(taka.canonicalSuttaId('an2.11-20')).toBe('AN2.11-20');
    expect(taka.canonicalSuttaId('AN2.11-20')).toBe('AN2.11-20');
    expect(taka.canonicalSuttaId('An2.11-20')).toBe('AN2.11-20');

    // name
    expect(taka.canonicalSuttaId('an2.12', 'name'))
      .toBe('Aṅguttara Nikāya 2.12');
    expect(taka.canonicalSuttaId('AN2.12', 'name'))
      .toBe('Aṅguttara Nikāya 2.12');
    expect(taka.canonicalSuttaId('An2.12', 'name'))
      .toBe('Aṅguttara Nikāya 2.12');

    // MN44
    expect(taka.canonicalSuttaId('mn44')).toBe('MN44');
    expect(taka.canonicalSuttaId('mn44', 'acro')).toBe('MN44');
    expect(taka.canonicalSuttaId('mn44', 'name'))
      .toBe('Majjhima Nikāya 44');

    // other
    expect(taka.canonicalSuttaId('thig1.1')).toBe('Thig1.1');
    expect(taka.canonicalSuttaId('thig1.1', 'name'))
      .toBe('Therīgāthā 1.1');
    expect(taka.canonicalSuttaId('snp1.1')).toBe('Snp1.1');
    expect(taka.canonicalSuttaId('snp1.1', 'name'))
      .toBe('Sutta Nipāta 1.1');
  });
});
