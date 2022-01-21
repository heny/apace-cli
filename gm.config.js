module.exports = {
  merge: {
    branch: [],
    default: ['main'],
  },
  publish: {
    branch: 'main',
    tag: true,
    latest: false,
  },
  commitDefault: {
    type: 'feat',
    module: 'src',
    message: 'logic',
  },
};
