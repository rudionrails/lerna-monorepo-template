const lispCase = /* #__PURE__ */ string =>
  string
    .replace(/[\W\s_-]+/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

const camelCase = /* #__PURE__ */ string =>
  lispCase(string).replace(/-(\w)/g, (_m, s) => s.toUpperCase());

const pascalCase = /* #__PURE__ */ string =>
  camelCase(string).replace(/^(\w)/, (_m, s) => s.toUpperCase());

module.exports = {
  lispCase,
  camelCase,
  pascalCase,
};
