#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Axios = require('axios');
const { logger } = require('log-instance');
const { Memoizer } = require('memo-again');
const {
    BilaraData,
    BilaraPathMap,
    ExecGit,
} = require('scv-bilara');
const APP_DIR = path.join(__dirname, '..', '..');
const API_DIR = path.join(APP_DIR, 'api');
const SRC_DIR = path.join(APP_DIR, 'src');
const LOCAL_DIR = path.join(APP_DIR, 'local');
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
    let name = 'ebt-data';
    let root = path.join(LOCAL_DIR, name);
    let bpOpts = { root };
    let bilaraPathMap = new BilaraPathMap(bpOpts)
    await bilaraPathMap.initialize();
    let suidMap = await bilaraPathMap.buildSuidMap();
    let suidJson = JSON.stringify(suidMap, null, '\t');
    await fs.promises.writeFile(SRC_SUIDMAPJSON, suidJson);
} catch(e) {
    logger.warn(e);
}})();
