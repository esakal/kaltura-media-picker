const spawnSync = require('child_process').spawnSync;
const fsExtra = require('fs-extra');
const path = require('path');
var ghpages = require('gh-pages');
const replace = require('replace-in-file');

const targetPath = path.resolve(__dirname, '../dist/apps/playground')
const mediaSourcePath = path.resolve(__dirname, '../dist/libs/media-query');

(async function() {

  spawnSync('npm', ['run', `build`], {
    stdio: ['inherit', 'inherit', 'inherit'],
  });

  await replace({
    files: path.resolve(targetPath, 'index.html'),
    from: '<base href="/">',
    to: '<base href="/kaltura-media-picker">',
  });

  fsExtra.copySync(
    path.resolve(mediaSourcePath, 'media-query.esm.js'),
    path.resolve(targetPath, 'media-query.esm.js')
  );

  fsExtra.copySync(
    path.resolve(mediaSourcePath, 'media-query.umd.js'),
    path.resolve(targetPath, 'media-query.umd.js')
  );

  ghpages.publish(targetPath, function(err) {
    console.log(err)
  }).then(r => {
    console.log('done')
  });
})();
