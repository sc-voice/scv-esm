#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Axios = require("axios");
const { logger } = require("log-instance");
const { Memoizer } = require("memo-again");
const { BilaraData, BilaraPathMap, ExecGit } = require("scv-bilara");
const APP_DIR = path.join(__dirname, "..", "..");
const API_DIR = path.join(APP_DIR, "api");
const SRC_DIR = path.join(APP_DIR, "src");
const LOCAL_DIR = path.join(APP_DIR, "local");
const SRC_SUIDMAP_MJS = path.join(SRC_DIR, "auto", "suid-map.mjs");
const SRC_SUIDMAP_JSON = path.join(SRC_DIR, "auto", "suid-map.json");

logger.logLevel = "info";

(async function () {
  try {
    let execGit = new ExecGit({
      repo: "https://github.com/ebt-site/ebt-data.git",
      logger,
    });
    let bilaraData = await new BilaraData({
      name: "ebt-data",
      branch: "published",
      execGit,
    }).initialize(true);
    let name = "ebt-data";
    let root = path.join(LOCAL_DIR, name);
    let bpOpts = { root };
    let bilaraPathMap = new BilaraPathMap(bpOpts);
    await bilaraPathMap.initialize();
    let suidMap = await bilaraPathMap.buildSuidMap();
    let suidJson = JSON.stringify(suidMap, null, "\t");
    let suidMjs = [
      "const SUIDMAP = " + suidJson,
      "export default SUIDMAP;",
    ].join("\n");

    // The following file is imported by this package
    // and can be replaced with the suid_map.json file once
    // import assertions are fully supported in all browsers (est. 2023)
    await fs.promises.writeFile(SRC_SUIDMAP_MJS, suidMjs);

    // The following file is used by SuttaCentral to display Voice icon
    await fs.promises.writeFile(SRC_SUIDMAP_JSON, suidJson);
  } catch (e) {
    logger.warn(e);
  }
})();
