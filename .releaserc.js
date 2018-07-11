module.exports = {
  branch: 'master',
  tagFormat: 'v${version}',
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git'
  ],
  publish: [
    '@semantic-release/npm',
    '@semantic-release/github'
  ],
  verifyConditions: ['@semantic-release/npm', '@semantic-release/github'],
  /* verifyRelease: ['@semantic-release/npm', '@semantic-release/github']
    .map(require)
    .map(x => x.verifyConditions), */
  scripts: {
    postpublish: 'git tag -d "$(git describe --tags)"'
  }
};
