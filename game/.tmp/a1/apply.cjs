// usage: node apply.cjs file id newObjectText  — replaces the spec object with that id
const fs = require("fs");
const [file, id, txtFile] = process.argv.slice(2);
let src = fs.readFileSync(file, "utf8");
const at = src.indexOf(`id: "${id}"`);
if (at < 0) throw new Error("no id " + id);
const start = src.lastIndexOf("{", at);
const artAt = src.indexOf("art: `", at);
const tick = src.indexOf("`", artAt + 6);
const end = src.indexOf("}", tick) + 1;
src = src.slice(0, start) + fs.readFileSync(txtFile, "utf8").trim() + src.slice(end);
fs.writeFileSync(file, src);
console.log("replaced", id);
