#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { logger } = require("log-instance");
const APP_DIR = path.join(__dirname, "..", "..");
const LOCAL_DIR = path.join(APP_DIR, "local");
const { BilaraData, Seeker } = require(`scv-bilara`);
const SRC_DIR = path.join(APP_DIR, "src");
const EXAMPLES_PATH = path.join(SRC_DIR, "auto", "examples.mjs");
const EBT_DATA_DIR = path.join(LOCAL_DIR, "ebt-data");
const EXAMPLES_DIR = path.join(EBT_DATA_DIR, "examples");
const SCRIPT = path.basename(__filename);
const COMMENT = [`Auto-generated by ${SCRIPT}`];

logger.logLevel = "info";

(async function () {
  try {
    let bilaraData = new BilaraData();
    await bilaraData.syncEbtData();
    let exampleFiles = (await fs.promises.readdir(EXAMPLES_DIR)).filter((f) =>
      /examples-/.test(f)
    );
    logger.info(`exampleFiles`, exampleFiles);

    let now = new Date();
    let authors = [];
    let examples = {
      comment: COMMENT,
      authors,
    };
    let languages = [];
    for (exampleFile of exampleFiles) {
      let examplePath = path.join(EXAMPLES_DIR, exampleFile);
      let langExamples = (await fs.promises.readFile(examplePath))
        .toString()
        .split("\n")
        .filter((ex) => !!ex);
      if (langExamples.length) {
        let fileKeys = exampleFile.replace(".txt", "").split("-");
        let [prefix, lang, category = "sutta", version] = fileKeys;
        if (version == null) {
          logger.log(`${exampleFile}: ignored (deprecated file name)`);
          continue;
        }
        let author = fileKeys.slice(4).join("-");
        if (author) {
          languages.push(lang);
          authors.push({ lang, category, version, author });
          examples[lang] = langExamples;
          logger.log(
            `${exampleFile}: ${langExamples.length}`,
            JSON.stringify({ lang, category, version, author })
          );
        } else {
          logger.warn(`${exampleFile}: ignored (no author?)`);
        }
      }
    }
    let examplesJson = JSON.stringify(examples, null, 2) + "\n";
    let examplesMjs = [
      'const EXAMPLES = ' + examplesJson,
      'export default EXAMPLES;',
    ].join('\n');
    await fs.promises.writeFile(EXAMPLES_PATH, examplesMjs);
    logger.info(`updated ${EXAMPLES_PATH} (OK)`);
    logger.info(`DONE`);
  } catch (e) {
    logger.warn(e);
  }
})();
