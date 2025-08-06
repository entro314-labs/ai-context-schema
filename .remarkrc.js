module.exports = {
  plugins: [
    'remark-preset-lint-recommended',
    ['remark-lint-list-item-indent', 'space'],
    ['remark-lint-maximum-line-length', false], // Disable line length for schema docs
    ['remark-lint-no-file-name-irregular-characters', false], // Allow spaces in filenames
    ['remark-lint-no-duplicate-headings-in-section', false] // Allow duplicate headings for examples
  ]
};
