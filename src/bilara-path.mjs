export default class BilaraPath {
  constructor(bilaraPath) {
    Object.assign(this, BilaraPath.pathParts(bilaraPath));
  }

  static rootPath(mid, lang='pli', auth='ms') {
    return [
      'root',
      lang,
      `${auth}/sutta`,
      `${mid}_root-${lang}-${auth}.json`
    ].join('/');
  }

  static translationPath(mid,lang,auth) {
    return [
      'translation',
      lang,
      `${auth}/sutta`,
      `${mid}_translation-${lang}-${auth}.json`
    ].join('/');
  }

  static commentPath(mid,lang,auth) {
    return [
      'comment',
      lang,
      `${auth}/sutta`,
      `${mid}_comment-${lang}-${auth}.json`
    ].join('/');
  }

  static pathParts(bilaraPath) {
    var bpParts = bilaraPath.split('/');
    var fname = bpParts.pop();
    var type = bpParts[0];
    var lang = bpParts[1];
    var author_uid = bpParts[2];
    var category = bpParts[3];
    var collection = bpParts[4];
    var suid = fname.replace(/_.*$/,'');
    var suttaRef = `${suid}/${lang}/${author_uid}`;
    return {
      suid,
      type,
      category,
      collection,
      lang,
      author_uid,
      suttaRef,
      bilaraPath,
    };
  }

}
