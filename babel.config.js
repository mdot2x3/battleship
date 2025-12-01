// imported babel with npm to allow jest to recognize ESM syntax
module.exports = {
  // configure babel to target your current version of node
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
