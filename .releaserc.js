global.foobar = global.foobar ? global.foobar + 1 : 0
console.log('release opts was fetched', new Date(), global.foobar)

module.exports = {
  branch: 'master',
  tagFormat: 'v${version}',
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git'
  ],
  publish: [
    '@semantic-release/github',
    '@semantic-release/npm'
  ],
  verifyConditions: ['@semantic-release/npm', '@semantic-release/git'],
  /* verifyRelease: ['@semantic-release/npm', '@semantic-release/github']
    .map(require)
    .map(x => x.verifyConditions), */
};
