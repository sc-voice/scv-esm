#!/usr/bin/env node

// ESM Node ugliness
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Axios = require('axios');
const { logger } = require('log-instance');
const { Memoizer } = require('memo-again');
const {
    BilaraData,
    Publication,
    BilaraPathMap,
    ExecGit,
} = require('scv-bilara');
const APP_DIR = path.join(__dirname, '..', '..');
const API_DIR = path.join(APP_DIR, 'api');
const SRC_DIR = path.join(APP_DIR, 'src');
const SRC_SUIDMAPJSON = path.join(SRC_DIR, 'auto', 'suidmap.json');

logger.logLevel = 'info';

(async function(){ try {
    let execGit = new ExecGit({
        repo: 'https://github.com/ebt-site/ebt-data.git',
        logger,
    });
    let bilaraData = await new BilaraData({
        name: 'ebt-data',
        branch: 'published',
        execGit,
    }).initialize(true);
    let publication = await new Publication().initialize();
    let bilaraPathMap = await new BilaraPathMap({publication}).initialize();
    let suidMap = await bilaraPathMap.buildSuidMap();
    let suidJson = JSON.stringify(suidMap, null, '\t');
    await fs.promises.writeFile(SRC_SUIDMAPJSON, suidJson);
} catch(e) {
    logger.warn(e);
}})();
