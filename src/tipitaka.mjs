import { logger } from "log-instance/index.mjs";
import SuidMap from "./auto/suid-map.mjs";
import SuttaCentralId from "./sutta-central-id.mjs";
import { default as UID_EXPANSION } from "./uid-expansion.mjs";

export default class Tipitaka {
  constructor(opts = {}) {
    (opts.logger || logger).logInstance(this, opts);
    let { suidMap = SuidMap } = opts;
    let suids = Object.keys(suidMap).sort(SuttaCentralId.compareLow);
    Object.assign(this, {
      suidMap,
      suids,
    });
  }

  nikayaOfSuid(suid = "") {
    return suid.replace(/[-.0-9]+(\/.*)?/, "");
  }

  nextSuid(suid) {
    let { compareLow, compareHigh } = SuttaCentralId;
    let { suids } = this;
    let nikaya = this.nikayaOfSuid(suid);
    for (let i = 0; i < suids.length; i++) {
      let si = suids[i];
      let cmpL = compareHigh(suid, si);
      if (cmpL < 0) {
        return this.nikayaOfSuid(si) === nikaya ? si : null;
      }
    }
    return null;
  }

  previousSuid(suid) {
    let { compareLow, compareHigh } = SuttaCentralId;
    let { suids } = this;
    let nikaya = this.nikayaOfSuid(suid);
    for (let i = suids.length; 0 < i--; ) {
      let si = suids[i];
      let cmpL = compareLow(si, suid);
      if (cmpL < 0) {
        return this.nikayaOfSuid(si) === nikaya ? si : null;
      }
    }
    return null;
  }

  canonicalSuttaId(sutta_uid, type="acro") {
    const msg = 'Tipitaka.canonicalSuttaId()';
    sutta_uid = sutta_uid.toLowerCase();
    let nikaya = sutta_uid.replace(/[-0-9:.]+/, '');
    let [ue] = UID_EXPANSION.filter((ue) => ue.uid === nikaya);
    switch (type) {
      case "name":
        return sutta_uid.replace(ue.uid, ue.name+' ');
      case "acro":
      default:
        return sutta_uid.replace(ue.uid, ue.acro);
    }
  }
}
